import React, { useState } from 'react'
import { Paper, Typography, Button, OutlinedInput} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Axios from 'axios';

const FindPw = () => {

    const [email, setEmail] = useState<string>('');

    // /// 이메일 인증 부분 ///
    const [createNum, setCreateNum] = useState<string>('');
    const [verifyNum, setVerifyNum] = useState<string>('');
    const [isCompareValueCompleted, setIsCompareValueCompleted] = useState<string>('none')

    /// 비밀번호 변경 부분 ///
    const [newPassword, setNewPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');
    const [id, setId] = useState<string>('');

    const sendvalue = () => {
        if(!email) {
            alert('이메일을 입력해주세요.');
            return false;
        } else {
            alert('해당 이메일로 인증번호가 발송되었습니다. 인증번호 8자리를 입력해주세요.');
            let str = ''
            for (let i = 0; i < 8; i++) {
              str += Math.floor(Math.random() * 10)
            }
            setCreateNum(str);
            Axios.post('http://localhost:5000/sendEmail', {
                email,
                value: str
            }) 
        }
    }

    const compareValue = () => {
        if(createNum !== verifyNum) {
            alert('인증번호를 다시 확인해주세요.');
            return false;
        } else {
            setIsCompareValueCompleted('inline');
            Axios.get(`http://localhost:5000/readUser/${email}`, {
            }).then(res => {
                setId(res.data[0]._id);
            });
        }
    }

    const updatePw = () => {
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

    return (
        <Paper className="container" style={{ textAlign: 'center', padding: '20px' }}>
            <Typography variant="h5">비밀번호 찾기</Typography>
            <br/>
            <Typography variant="subtitle1">Email</Typography>
            <Typography variant="subtitle1">적은 메일로 인증메일이 전송됩니다.</Typography>
            <OutlinedInput
                type="text"
                inputProps={{
                    maxLength: 20,
                }}
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
                
                style={{ height: '20px', marginRight: '5px' }}
            />
            <Button
                variant="contained"
                style={{ height: '20px' }}
                onClick={sendvalue}
            >
                이메일인증
            </Button>
            <br/><br/>
            <Typography variant="subtitle1">인증번호 확인</Typography>
            <OutlinedInput
                type="text"
                inputProps={{
                    maxLength: 20,
                }}
                onChange={(e) => {
                    setVerifyNum(e.target.value);
                }}
                style={{ height: '20px', marginRight: '5px' }}
            />
            <Button 
                variant="contained" 
                style={{ height: '20px' }}
                onClick={compareValue}
            >
                인증번호확인
            </Button>
            <br/><br/>


            <div style={{ display: isCompareValueCompleted }}>
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
                    onClick={updatePw}
                >
                    수정하기
                </Button>
            </div>
        </Paper>
    )
}

export default FindPw
