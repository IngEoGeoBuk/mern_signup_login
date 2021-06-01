import React, { useState, useEffect } from 'react'
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link, useHistory  } from 'react-router-dom';
import Axios from 'axios';

const UpdatePw = () => {

    const history = useHistory();
    const [curPassword, setCurPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');

    const email = window.localStorage.getItem("email")?.substr(1).slice(0,-1);

    const updatePw = () => {
        if(!curPassword) {
            alert('현재 비밀번호를 입력해주세요.');
            return false;
        } 
        if(curPassword === newPassword) {
            alert('현재 비밀번호와 변경할 비밀번호는 달라야 합니다.');
            return false;
        }
        if(!newPassword) {
            alert('변경할 비밀번호를 입력하세요.');
            return false;
        }
        if(!rePassword) {
            alert('변경할 비밀번호를 다시 입력해주세요.');
            return false;
        }
        if(newPassword !== rePassword) {
            alert('변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return false;
        }

        Axios.post('http://localhost:5000/login', {
            email, password: curPassword
        }).then(res => {
            if (res.data.auth === false) {
                alert('현재 비밀번호가 옳지 않습니다.');
                return false;
            } else {
                const id = res.data.result[0]._id;
                Axios.put(`http://localhost:5000/updatePw`, {
                    id, newPassword
                }).then(res => {
                    if (res.status === 200) {
                        alert('비밀번호 변경에 성공하였습니다. 재로그인 해주세요.');
                        window.localStorage.clear();
                        window.location.href = "/";
                    } else {
                        console.log('비밀번호 변경 실패');
                    }
                });
            }
        });
    }



    return (
        <Paper className="container" style={{ textAlign: 'center', padding: '20px' }}>
            <Typography variant="h5">비밀번호 변경</Typography>
            <br/>
            <Typography variant="subtitle1">현재 비밀번호</Typography>
            <input 
                type="password"
                onChange={(e) => {
                    setCurPassword(e.target.value);
                }}
                maxLength={20}
            />

            <Typography variant="subtitle1">변경할 비밀번호</Typography>
            <input 
                type="password"
                onChange={(e) => {
                    setNewPassword(e.target.value);
                }}
                maxLength={20}
            />
            <Typography variant="subtitle1">변경할 비밀번호 재입력</Typography>
            <input 
                type="password"
                onChange={(e) => {
                    setRePassword(e.target.value);
                }}
                maxLength={20}
            />
            <br/><br/><br/>
            <Button 
                variant="contained" 
                style={{ width: '120px', margin: '0px 20px' }} 
                onClick={() => history.push('/mypage')}
            >
                뒤로가기
            </Button>
            <Button 
                variant="contained" 
                style={{ width: '120px', margin: '0px 20px' }} 
                onClick={updatePw}
            >
                수정하기
            </Button>
            <br/><br/><br/>
        </Paper>
    )
}

export default UpdatePw
