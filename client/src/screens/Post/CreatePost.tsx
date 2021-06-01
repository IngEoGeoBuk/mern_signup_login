import React, { useState } from 'react'
import Axios from 'axios';
import { Paper, OutlinedInput, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

const CreatePost = () => {
    const history = useHistory();

    const email = window.localStorage.getItem("email")?.substr(1).slice(0,-1);
    const time = moment().format('YYYY-MM-DD:HH:mm:ss');

    const [title, setTitle] = React.useState<string>("");
    const [contents, setContents] = useState<string>("");

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

    return (
        <Paper style={{ padding: '20px' }}>
            <Typography>글쓴이: {email}</Typography>
            <Typography>글쓴시간: {time}</Typography>
            <br/>
            <Typography>제목</Typography>
              <input
                  type="text"
                  onChange={(e) => {
                  setTitle(e.target.value);
                  }}
                  maxLength={20}
                  style={{ width: '600px' }}
              />
            <Typography>내용</Typography>
              <OutlinedInput
                  type="text"
                  onChange={(e) => {
                  setContents(e.target.value);
              }}
                style={{ width: '600px' }}
            />
            <br/><br/>
            <Button variant="contained" onClick={create}>글 작성</Button>
        </Paper>
    )
}

export default CreatePost
