import React from 'react'
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link  } from 'react-router-dom';

import UpdatePw from './UpdatePw'


const MyPage = () => {
    const email = window.localStorage.getItem("email")?.substr(1).slice(0,-1);

    return (
        <Paper style={{ textAlign: 'center', padding: '20px' }}>
            {email}님 정보수정 페이지입니다.
            <br/><br/><br/>
            <div>
                <Button variant="contained" style={{ width: '150px', margin: '0 10px' }}>
                    <Link to='/mypage/updatePw' style={{ color: 'black' }}>비밀번호 변경</Link>
                </Button>
                <Button variant="contained" style={{ width: '150px', margin: '0 10px' }}>
                    <Link to='/mypage/deleteUser' style={{ color: 'black' }}>회원탈퇴</Link>
                </Button>
            </div>
        </Paper>
    )
}

export default MyPage
