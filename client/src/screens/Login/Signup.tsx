import React, { useState, useEffect } from 'react'
import { Paper, Typography, Button } from '@material-ui/core';
import { Link, useHistory  } from 'react-router-dom';
import Axios from 'axios';

const Signup = () => {
    const [userList, setUserList] = useState<string[]>([]);
    useEffect(() => {
        Axios.get('http://localhost:5000/readUsers')
        .then((res) => res.data.forEach((e : any) => {
            setUserList(userList => [...userList, e.email])
        }));
    }, [])

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');

    /// 이메일 인증 부분 ///
    const [checkRedundancyEmail, setCheckRedundancyEmail] = useState<boolean>(false);
    const [isEmailSended, setIsEmailSended] = useState<boolean>(false);
    const [isCompareValueCompleted, setIsCompareValueCompleted] = useState<boolean>(false)
    const [createNum, setCreateNum] = useState<string>('')
    const [verifyNum, setVerifyNum] = useState<string>('')

    const test = [1,2,3];

    const checkEmail = () => {
        if (!email) {
            alert('이메일을 입력해주세요.');
            return false;
        } else {
            if (userList.indexOf(email) === -1) {
                alert('해당 이메일은 사용이 가능합니다.');
                setCheckRedundancyEmail(true);
            } else {
                alert('중복된 이메일이 존재합니다.');
            }
        }
    }

    const sendvalue = () => {
        if(!email) {
            alert('이메일을 입력해주세요.');
            return false;
        } else if (!checkRedundancyEmail) {
            alert('이메일을 중복체크 과정을 진행해주세요.');
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

            setIsEmailSended(true);
        }
    }

    const compareValue = () => {
        if(createNum !== verifyNum) {
            alert('인증번호를 다시 확인해주세요.');
            return false;
        } else {
            setIsCompareValueCompleted(true);
        }
    }
    /// 이메일 인증 부분 끝 ///
    const history = useHistory();

    

    const register = () => {
        if(!email) {
            alert('이메일을 입력해주세요.');
            return false;
        } 

        if (!checkRedundancyEmail) {
            alert('이메일을 중복체크 과정을 진행해주세요.');
            return false;
        }

        if(!isEmailSended || !isCompareValueCompleted) {
            alert('이메일 인증 절차를 진행해주세요.');
            return false;
        }

        if(!password) {
            alert('비밀번호를 입력해주세요.');
            return false;
        }
        if(password !== rePassword) {
            alert('비밀번호와 비밀번호 재입력이 일치하지 않습니다.');
            return false;
        }

        Axios.post(`http://localhost:5000/register`, {
            email, password
        }).then(res => {
            if(res.status === 200) {
                alert('회원가입에 성공하셨습니다.');
                history.push('/login')
            } else {
                alert('회원가입에 실패하셨습니다.')
            }
        });

    }

    return (
        <Paper className="container" style={{ textAlign: 'center', padding: '20px' }}>
            비밀번호 해쉬화해서 저장하니 걱정마세요.
            <Typography variant="h5">Signup</Typography>
            <br/>
            <Typography variant="subtitle1">Email</Typography>
            <Typography variant="subtitle2">적은 메일로 인증메일이 전송됩니다.</Typography>
            {!checkRedundancyEmail ? 
                <input
                    type="text"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    maxLength={20}
                /> : <div>{email}</div>
            }

            {!checkRedundancyEmail ? 
                <button onClick={() => checkEmail()}>이메일중복체크</button> :
                <div>중복확인완료</div>
            }
            <br/><br/>
            <Typography variant="subtitle1">인증번호 확인</Typography>
            <input
                type="text"
                onChange={(e) => {
                setVerifyNum(e.target.value);
                }}
            />
            {!isEmailSended? 
                <button onClick={() => sendvalue()}>인증메일받기</button> :
                <>
                    {!isCompareValueCompleted ? 
                        <button onClick={() => compareValue()}>인증확인</button> :
                        <div>인증확인완료</div>
                    }
                </>
            }
            
            <br/><br/>

            <Typography variant="subtitle1">비밀번호</Typography>
            <input 
                type="password"
                onChange={(e) => {
                    setPassword(e.target.value);
                }}
                maxLength={20}
            />
            <br/><br/>
            <Typography variant="subtitle1">비밀번호 재입력</Typography>
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
                onClick={() => history.push('/login')}
            >
                Back
            </Button>
            <Button 
                variant="contained" 
                style={{ width: '120px', margin: '0px 20px' }} 
                onClick={register}
            >
                Register
            </Button>
            <br/><br/><br/>
        </Paper>
    )
}

export default Signup
