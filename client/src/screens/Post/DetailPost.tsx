import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/ko';

import { Paper, OutlinedInput, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

/// 게시판 부분
interface postTypes {
    _id: string;
    email: string;
    title: string;
    contents: string;
    time: Date;
    updated_time?: Date;
    __v? : Number;
}

const DetailPost = ({ match }: any) => {    
    const getEmail = window.localStorage.getItem("email")?.substr(1).slice(0, -1);
    const getId = match.params.id;
    const id = `${getId}`;
    const history = useHistory();
    
    const [postList, setPostList] = useState<postTypes[]>([]);

    useEffect(() => {
        Axios.get(`http://localhost:5000/readOne/${id}`)
            .then((res) => setPostList(res.data));
    }, [])

    const deletePost = (id: string) => {
        if (window.confirm('글을 삭제하시겠습니까?')) {
            Axios.delete(`http://localhost:5000/deletePost/${id}`)
            .then((res) => {
                alert('글이 삭제 되었습니다.')
                history.push('/');
            });
        }
    }

    return (
        <Paper style={{ padding: '20px' }}>
            {postList.map(( val: postTypes, key: number ) => {
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>제목: {val.title}</Typography>
                            {getEmail === val.email ? 
                                <div style={{ display: 'flex' }}>
                                    <Link to={`/updatePost/${val._id}`}
                                        style={{ display: 'flex', cursor: 'pointer', textDecoration: 'none', color: 'black' }}
                                    >
                                        <EditIcon />
                                        <Typography>수정</Typography>
                                    </Link>
                                    &emsp;
                                    <div 
                                        style={{ display: 'flex', cursor: 'pointer' }}
                                        onClick={() => { deletePost(val._id) }}
                                    >
                                        <DeleteIcon />
                                        <Typography>삭제</Typography>
                                    </div>
                                </div> : <div></div>
                            }

                        </div>
                        <Typography>작성자: {val.email}</Typography>
                        <br/>
                        <Typography>글 내용: </Typography>
                        <div>{val.contents}</div>
                        <br />
                        <Typography>작성시간: {val.time}</Typography>
                        <Typography>수정시간: {val.updated_time}</Typography>
                    </>
                )
            })}
        </Paper>
    )
}

export default DetailPost
