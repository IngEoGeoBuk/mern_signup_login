import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { Paper, OutlinedInput, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import * as config from '../../components/Config'


const CreatePost = ({ match }: any) => {
    const history = useHistory();

    const email = window.localStorage.getItem("email")?.substr(1).slice(0,-1);
    const time = moment().format('YYYY-MM-DD:HH:mm:ss');

    const [title, setTitle] = useState<string>("");
    const [contents, setContents] = useState<string>("");
    const [createdTime, setcreatedTime] = useState<string>("");
    const [uploadedImgPreview, setUploadedImgPreview] = useState<string>("");
    const [prevImg, setPrevImg] = useState<string>("");
    const [imageSelected, setImageSelected] = useState<any>("");

    const formData = new FormData()
    formData.append("file", imageSelected)
    formData.append("upload_preset", `${config.APPEND_KEY}`)

    const create = () => {
        if(!title) {
            alert('제목을 입력하세요.');
            return false;
        }
        if(!contents) {
            alert('내용을 입력하세요.');
            return false;
        }

        if(imageSelected.type.split('/')[0] !== 'image') {
            alert('이미지만 업로드 가능합니다.')
            return false;
        }

        if(imageSelected) {
            Axios.post(`https://api.cloudinary.com/v1_1/${config.CLOUDINARY_KEY}/image/upload`, formData)
            .then((res) => {
                const image = res.data.url
                Axios.post('http://localhost:5000/post/createPost', {
                    email, title, contents, time, image
                }).then((res) => {
                    history.push('/');
                }).catch((err) => {
                    console.log(err);
                })
            })
        } else {
            Axios.post('http://localhost:5000/post/createPost', {
                email, title, contents, time
            }).then((res) => {
                history.push('/');
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    /// 글 수정 부분 ///
    const getId = match.params.id;
    const id = `${getId}`;
    useEffect(() => {
        if (getId) {
            Axios.get(`http://localhost:5000/post/readOne/${id}`)
            .then((res) => {
                setTitle(res.data[0].title)
                setContents(res.data[0].contents)
                setcreatedTime(res.data[0].time)
                setPrevImg(res.data[0].image)
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

        if(imageSelected.type.split('/')[0] !== 'image') {
            alert('이미지만 업로드 가능합니다.')
            return false;
        }

        if(imageSelected) {
            Axios.post(`https://api.cloudinary.com/v1_1/djt4l0eoz/image/upload`, formData)
            .then((res) => {
                const image = res.data.url
                Axios.put(`http://localhost:5000/post/updatePost/${id}`, {
                    title, contents, time, image
                })
                window.location.replace("/");
            })
        } else {
            Axios.put(`http://localhost:5000/post/updatePost/${id}`, {
                title, contents, time
            })
            window.location.replace("/");
        }
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
            {uploadedImgPreview ? 
                <img src={uploadedImgPreview} alt="" /> :
                <img src={prevImg} alt="" />
            }
            <br/><br/>
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                    setImageSelected(e.target.files![0])
                    setUploadedImgPreview(URL.createObjectURL(e.target.files![0]))
                }}
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
