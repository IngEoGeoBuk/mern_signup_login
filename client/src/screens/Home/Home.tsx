import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ReactPaginate from 'react-paginate';
import './Home.css';

interface postTypes {
    _id: string;
    title: string;
    contents: string;
}

const Home = () => {
    const [postList, setPostList] = useState<postTypes[]>([]);

    useEffect(() => {
        // 게시글 불러오기
        Axios.get('http://localhost:5000/readPost')
        .then((res) => setPostList(res.data));
    }, [])

    const [pageNumber, setPageNumber] = useState(0);
    const postPerPage = 5;
    const pagesVisited = pageNumber * postPerPage;

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
                        {/* <div style={{ display: 'flex', padding: '0 10px' }}>
                            <div style={{ display: 'flex' }}>
                                <ThumbUpAltIcon style={{ padding: '0 5px' }}  />
                                <ReadLike poId={val._id}/>
                            </div>
                            <div style={{ display: 'flex', padding: '0 10px' }}>
                                <ThumbDownIcon style={{ padding: '0 5px' }} />
                                <ReadDislike poId={val._id}/>
                            </div>
                        </div> */}
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
