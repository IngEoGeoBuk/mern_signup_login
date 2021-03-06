import React, { useState, useEffect } from 'react'
import { ThumbUpAltOutlined, ThumbDownAltOutlined, ThumbUpAlt, ThumbDown } from '@material-ui/icons';
import Axios from 'axios';
import Typography from '@material-ui/core/Typography';

interface getProps{
    poId: string;
    email: string;
}

const Like_Dislike: React.FC<getProps> = ({ poId, email }) => {

    const [yourLiked, setYourLiked] = useState<string>('');
    const [yourDisliked, setYourDisliked] = useState<string>('');
    const [readLike, setReadLike] = useState<number>(0);
    const [readDislike, setReadDislike] = useState<number>(0);

    useEffect(() => {
        // 너가 좋아요를 눌렀는지 안 눌렀는지 
        Axios.get(`http://localhost:5000/likeDislike/readYourLike/${poId}/${email}`)
        .then((res) => {
            setYourLiked(res.data[0]._id)
        })
        .catch((error : any ) => console.log('당신은 이 영상에 좋아요를 누르지 않았습니다.'))
        Axios.get(`http://localhost:5000/likeDislike/readYourDislike/${poId}/${email}`)
        .then((res) => {
            setYourDisliked(res.data[0]._id)
        })
        .catch((error : any ) => console.log('당신은 이 영상에 싫어요를 누르지 않았습니다.'))

        // 전체 좋아요 & 싫어요 갯수
        Axios.get(`http://localhost:5000/likeDislike/ReadDislike/${poId}`)
        .then((res) => {
            setReadDislike(res.data.length)
        })
        .catch((error : any ) => console.log('이 영상엔 좋아요 또는 싫어요가 없습니다.'))

        Axios.get(`http://localhost:5000/likeDislike/ReadLike/${poId}`)
        .then((res) => {
            setReadLike(res.data.length)
        })
        .catch((error : any ) => console.log('이 영상엔 좋아요 또는 싫어요가 없습니다.'))
    }, [])


    const upLike = () => {
        if(!email) {
            alert('로그인을 하셔야 가능합니다.');
            return false;
        } else {
            if(yourDisliked) {
                Axios.delete(`http://localhost:5000/likeDislike/unDislike/${yourDisliked}`)
                .then((res) => {
                    setYourDisliked('')
                    setReadDislike(readDislike - 1)
                });
            }
            Axios.post('http://localhost:5000/likeDislike/upLike', {
                poId, email
            }).then((res) => {
                setYourLiked(res.data._id)
                setReadLike(readLike + 1)
            });
        }
    }

    const unLike = () => {
        if(!email) {
            alert('로그인을 하셔야 가능합니다.');
            return false;
        } else {
            Axios.delete(`http://localhost:5000/likeDislike/unLike/${yourLiked}`)
            .then((res) => {
                setYourLiked('')
                setReadLike(readLike - 1)
            });
        }
    }
 
    const upDislike = () => {
        if(!email) {
            alert('로그인을 하셔야 가능합니다.');
            return false;
        } else {
            if(yourLiked) {
                Axios.delete(`http://localhost:5000/likeDislike/unLike/${yourLiked}`)
                .then((res) => {
                    setYourLiked('')
                    setReadLike(readLike - 1)
                });               
            }
            Axios.post('http://localhost:5000/likeDislike/upDislike', {
                poId, email
            }).then((res) => {
                setYourDisliked(res.data._id)
                setReadDislike(readDislike + 1)
            });
        }
    }

    const unDislike = () => {
        if(!email) {
            alert('로그인을 하셔야 가능합니다.');
            return false;
        } else {
            Axios.delete(`http://localhost:5000/likeDislike/unDislike/${yourDisliked}`)
            .then((res) => {
                setYourDisliked('')
                setReadDislike(readDislike - 1)
            });
        }
    }

    return (
        <div style={{ justifyContent: 'center', textAlign: 'center' }}>
            {yourLiked ? 
            <ThumbUpAlt
                style={{padding: '10px', cursor: 'pointer'}}
                onClick={() => unLike()}
            /> :             
            <ThumbUpAltOutlined
                style={{padding: '10px', cursor: 'pointer'}}
                onClick={() => upLike()}
            />            
            }
            {yourDisliked ?
            <ThumbDown 
                style={{padding: '10px', cursor: 'pointer'}}
                onClick={() => unDislike()} 
            /> :
            <ThumbDownAltOutlined
                style={{padding: '10px', cursor: 'pointer'}}
                onClick={() => upDislike()} 
            /> 
            }
            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                <Typography style={{ padding: '0px 10px' }}>
                    {readLike}
                </Typography>
                <Typography style={{ padding: '0px 10px' }}>
                    {readDislike}
                </Typography>
            </div>

        </div>
    )
}

export default Like_Dislike
