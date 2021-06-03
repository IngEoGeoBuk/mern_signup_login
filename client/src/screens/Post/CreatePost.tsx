import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { Paper, OutlinedInput, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

const CreatePost = ({ match }: any) => {
    const history = useHistory();

    const email = window.localStorage.getItem("email")?.substr(1).slice(0,-1);
    const time = moment().format('YYYY-MM-DD:HH:mm:ss');

    const [title, setTitle] = useState<string>("");
    const [contents, setContents] = useState<string>("");
    const [createdTime, setcreatedTime] = useState<string>("");

    const create = () => {
        if(!title) {
            alert('제목을 입력하세요.');
            return false;
        }
        if(!contents) {
            alert('내용을 입력하세요.');
            return false;
        }

        Axios.post('http://localhost:5000/createPost', {
            email, title, contents, time
        })
        .then((res) => {
            history.push('/');
        })
        .catch((err) => {
            console.log(err);
        })
    }

    /// 글 수정 부분 ///
    const getId = match.params.id;
    const id = `${getId}`;
    useEffect(() => {
        if (getId) {
            Axios.get(`http://localhost:5000/readOne/${id}`)
            .then((res) => {
                setTitle(res.data[0].title)
                setContents(res.data[0].contents)
                setcreatedTime(res.data[0].time)
            })
        }

    }, [])
    
    const update = () => {
        if (!title) {
            alert('제목을 입력하세요.');
            return false;
        }
        if (!contents) {
            alert('내용을 입력하세요.');
            return false;
        }

        Axios.put(`http://localhost:5000/updatePost/${id}`, {
            title, contents, time
        })
        window.location.replace("/");
    }
    /// 글 수정 부분 끝 ///


    return (
        <Paper style={{ padding: '20px' }}>
            <Typography variant="h5">
                {getId ? <>글 수정</> : <>글 작성</>}
            </Typography>
            <br/>
            <Typography>글쓴이: {email}</Typography>
            <Typography>글쓴시간: {createdTime}</Typography>
            <Typography>수정시간: {time}</Typography>
            <br/>
            <Typography>제목</Typography>
              <input
                  type="text"
                  onChange={(e) => {
                  setTitle(e.target.value);
                  }}
                  maxLength={20}
                  style={{ width: '75%' }}
                  value={title}
              />
            <Typography>내용</Typography>
              <OutlinedInput
                  type="text"
                  onChange={(e) => {
                    setContents(e.target.value);
                  }}
                  value={contents}
                  style={{ width: '75%' }}
            />
            <br/><br/>
            {getId ? 
                <Button variant="contained" onClick={update}>글 수정</Button> :
                <Button variant="contained" onClick={create}>글 작성</Button>
            }
            
        </Paper>
    )
}

export default CreatePost
