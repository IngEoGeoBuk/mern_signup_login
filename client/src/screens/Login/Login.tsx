import React, { useState } from 'react'
import { Paper, OutlinedInput, Button, Typography } from '@material-ui/core';
import { Link  } from 'react-router-dom';
import Axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const login = () => {
        if(!email || !password) {
            alert('아이디 또는 비밀번호를 입력하세요.');
            return false;
        }

        Axios.post('http://localhost:5000/login', {
            email, password
        }).then(res => {
            if(res.data.auth === true) {
                window.localStorage.setItem("email", JSON.stringify(email));
                window.location.href = "/";
            } else {
                if(res.data.message === 'no user exists') {
                    alert('존재하지 않는 아이디입니다.');
                    return false;
                }
                if(res.data.message === 'wrong username || password') {
                    alert('아이디 또는 비밀번호가 일치하지 않습니다.');
                    return false;
                }
            }
        });
    }

    return (
        <Paper className="container" style={{ textAlign: 'center', padding: '20px' }}>
            <Typography variant="h5">Login</Typography>
            <br/>
            <Typography variant="subtitle1">Email</Typography>

            <OutlinedInput
                inputProps={{
                    maxLength: 20,
                }}
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
                type="text"
                style={{ height: '20px' }}
            />

            <Typography variant="subtitle1">Password</Typography>
            <OutlinedInput
                inputProps={{
                    maxLength: 20,
                }}
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
                type="password"
                style={{ height: '20px' }}
            />
            <br/><br/><br/>
            <Button variant="contained" onClick={login}>Login</Button>
            <br/><br/><br/>
            <Link to='/findPw' style={{ padding: '0 10px', color: 'black' }}>findpw</Link>
            <Link to='/signin' style={{ padding: '0 10px', color: 'black' }}>sign up</Link>
        </Paper>
    )
}

export default Login
