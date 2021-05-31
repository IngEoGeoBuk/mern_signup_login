import React, { useState, useEffect } from 'react'
import { Link, useHistory  } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';
import Axios from 'axios';

const DeleteUser = () => {

    const email = window.localStorage.getItem("email")?.substr(1).slice(0,-1);
    const history = useHistory();

    const [deleteEmail, setDeleteEmail] = useState<string>('');
    const [deletePw, setDeletePw] = useState<string>('');

    const deleteSend = () => {
        Axios.post('http://localhost:5000/login', {
            email: deleteEmail, password: deletePw
        }).then(res => {
            if(!res.data.auth) {
                alert('아이디와 비밀번호를 다시 확인해주세요.')
                return false;
            } else {
                const id = res.data.result[0]._id;
                Axios.delete(`http://localhost:5000/deleteUser/${id}`)
                .then(res =>  {
                    alert('계정 탈퇴가 완료되었습니다.')
                    window.localStorage.clear();
                    window.location.href = "/";
                })
                .catch(err => console.log(err));

            }
        });

    }

    return (
        <Paper className="container" style={{ textAlign: 'center', padding: '20px' }}>
            <Typography variant="h5">회원탈퇴 </Typography>
            <br/>
            <Typography variant="subtitle1">회원님의 계정과 비밀번호를 입력하세요.</Typography>


            <Typography variant="subtitle1">회원님의 계정</Typography>
            <input 
                type="text"
                onChange={(e) => {
                    setDeleteEmail(e.target.value);
                }}
                maxLength={20}
            />
            <Typography variant="subtitle1">회원님의 비밀번호</Typography>
            <input 
                type="password"
                onChange={(e) => {
                    setDeletePw(e.target.value);
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
                onClick={deleteSend}
            >
                계정삭제
            </Button>
            <br/><br/><br/>
        </Paper>
    )
}

export default DeleteUser
