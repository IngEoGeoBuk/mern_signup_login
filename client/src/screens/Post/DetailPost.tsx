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

/// 댓글 부분
interface commentTypes {
    _id: string;
    poId: string;
    email: string;
    context: string;
    time: string;
    updated_time?: Date;
    __v?: Number;
}


const DetailPost = ({ match }: any) => {    
    /// 게시판 부분 ///
    const getEmail = window.localStorage.getItem("email")?.substr(1).slice(0, -1);
    const time = moment().format('YYYY-MM-DD:HH:mm:ss');

    
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
    /// 게시판 부분 끝 ///


    /// 댓글 부분 ///
    const [comments, setComments] = useState<string>('');
    const [commentList, setCommentList] = useState<commentTypes[]>([]);
    const createComment = () => {
        if (!comments) {
            alert("댓글 내용을 입력해주세요.");
            return false;
        }
        Axios.post('http://localhost:5000/createComment', {
            poId: getId, email: getEmail, context: comments, time
        }).then((res: any) => {
            setCommentList([
                ...commentList, res.data
            ])
        })
        setComments('');
    }

    /// 댓글 부분 끝 ///

    return (
        <>
            {postList.map(( val: postTypes, key: number ) => {
                return (
                    <Paper style={{ padding: '20px' }}>
                        <h3 style={{ display: 'none' }}>{key}</h3>
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
                    </Paper>
                )
            })}
            <br/>
            <div>
                {getEmail ?
                    <div>
                        <div style={{ paddingBottom: '10px' }}>
                            <OutlinedInput
                                style={{ width: '75%' }}
                                type="text"
                                onChange={(e) => {
                                    setComments(e.target.value);
                                }}
                                value={comments}
                            />
                        </div>
                        <Button 
                            variant="contained"
                            onClick={createComment}
                        >
                            댓글달기
                        </Button>
                        <br /><br />
                    </div>
                    : <div></div>
                }

                {commentList.map((val: commentTypes, key: number) => {
                    return (
                        <>
                            <Paper style={{ padding: '10px' }} elevation={2}>
                                <h3 style={{ display: 'none' }}>{key}</h3>
                                <div>
                                    <Typography>작성자: {val.email}</Typography>
                                    <Typography>내용: </Typography>
                                    <Typography>{val.context}</Typography>
                                    <Typography>작성시간 {val.time}</Typography>
                                </div>
                            </Paper>
                            <br/>
                        </>
                    )
                })}
            </div>

        </>
    )
}

export default DetailPost
