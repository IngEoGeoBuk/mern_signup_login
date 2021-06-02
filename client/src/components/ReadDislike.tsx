import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import Typography from '@material-ui/core/Typography';

interface getProps{
    poId: string;
}

const ReadDislike: React.FC<getProps> = ({ poId }) => {
    const [ReadDislike, setReadDislike] = useState<number>(0);

    useEffect(() => {
        // 전체 좋아요 & 싫어요 갯수
        Axios.get(`http://localhost:5000/ReadDislike/${poId}`)
        .then((res) => (
            setReadDislike(res.data.length)
        ))
        .catch((error : any ) => console.log('이 영상엔 좋아요 또는 싫어요가 없습니다.'))
    }, [])

    return (
        <Typography style={{ padding: '0px 10px' }}>
            {ReadDislike}
        </Typography>
            
    )
}

export default ReadDislike
