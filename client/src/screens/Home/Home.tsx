import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Paper, Typography } from '@material-ui/core'
import ReactPaginate from 'react-paginate';
import { ThumbUpAlt, ThumbDown } from '@material-ui/icons';

import './Home.css';

interface postTypes {
    _id: string;
    title: string;
    contents: string;
}

interface getProps {
    poId: string;
}

const Home = () => {
    const [postList, setPostList] = useState<postTypes[]>([]);
    const curLink = document.location.href.split('/');

    useEffect(() => {
        // 게시글 불러오기
        Axios.get('http://localhost:5000/post/readPost')
        .then((res) => setPostList(res.data.reverse()));
    }, [])    

    const [pageNumber, setPageNumber] = useState(0);
    const postPerPage = 5;
    const pagesVisited = pageNumber * postPerPage;

    /// 전체에서 좋아요 싫어요 불러오기(왜인지는 몰라도 import로 불러오면 반응을 못함) ///
    const ReadLike: React.FC<getProps> = ({ poId }) => {
        const [readLike, setReadLike] = useState<number>(0);
        useEffect(() => {
            // 전체 좋아요 & 싫어요 갯수
            Axios.get(`http://localhost:5000/likeDislike/ReadLike/${poId}`)
                .then((res) => (
                    setReadLike(res.data.length)
                ))
                .catch((error: any) => console.log('이 영상엔 좋아요 또는 싫어요가 없습니다.'))
        }, [])

        return (
            <Typography style={{ padding: '0px 10px' }}>
                {readLike}
            </Typography>
        )
    }

    const ReadDislike: React.FC<getProps> = ({ poId }) => {
        const [ReadDislike, setReadDislike] = useState<number>(0);

        useEffect(() => {
            // 전체 좋아요 & 싫어요 갯수
            Axios.get(`http://localhost:5000/likeDislike/ReadDislike/${poId}`)
                .then((res) => (
                    setReadDislike(res.data.length)
                ))
                .catch((error: any) => console.log('이 영상엔 좋아요 또는 싫어요가 없습니다.'))
        }, [])

        return (
            <Typography style={{ padding: '0px 10px' }}>
                {ReadDislike}
            </Typography>

        )
    }
    //////

    const displayPosts = postList
    .slice(pagesVisited, pagesVisited + postPerPage)
    .map((val : postTypes , key : number) => {
        return (
            <div>
                <Paper elevation={2} style={{ padding: '10px' }} >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link to={`/detail/${val._id}`} style={{ textDecoration: 'none' }}>
                            <h3 style={{ display: 'none' }}>{key}</h3>
                            <Typography style={{ color: 'black' }}>{val.title}</Typography>
                        </Link>
                        <div style={{ display: 'flex', padding: '0 10px' }}>
                            <div style={{ display: 'flex' }}>
                                <ThumbUpAlt style={{ padding: '0 5px' }}  />
                                <ReadLike poId={val._id}/>
                            </div>
                            <div style={{ display: 'flex', padding: '0 10px' }}>
                                <ThumbDown style={{ padding: '0 5px' }} />
                                <ReadDislike poId={val._id}/>
                            </div>
                        </div>
                    </div>
                </Paper>
                <br/>                    
            </div>
        );
    });

    const pageCount = Math.ceil(postList.length / postPerPage);

    const changePage = ({ selected } : any) => {
        setPageNumber(selected);
    };

    return (
        <div className="App">
            {displayPosts}
            <div className="pagination">
            <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                pageCount={pageCount}
                onPageChange={changePage}
                breakLabel={"..."}
                breakClassName={"break-me"}
                marginPagesDisplayed={5}
                pageRangeDisplayed={5}
                containerClassName={"pagination"}
                // activeClassName={"active"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            />
            </div>
        </div>
    );
}

export default Home
