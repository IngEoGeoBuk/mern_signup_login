import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Login from './screens/Login/Login';
import Signin from './screens/Login/Signup';
import FindPw from './screens/Login/FindPw';

import Home from './screens/Home/Home';
import Best from './screens/Home/Best';

import MyPage from './screens/Mypage/MyPage'
import UpdatePw from './screens/Mypage/UpdatePw'
import DeleteUser from './screens/Mypage/DeleteUser';

import CreatePost from './screens/Post/CreatePost';
import DetailPost from './screens/Post/DetailPost';

// import UserInfoContext from './context/UserInfoContext';
// https://smujihoon.tistory.com/214

function App() {
  const email = window.localStorage.getItem("email")?.substr(1).slice(0,-1);

  return (
      <React.Fragment>
        <Container maxWidth="lg" style={{ padding: '0px' }}>
          <Router>
            {email ? 
              <div style={{ float: 'right' }}>
                {email}님 반갑습니다.
                <button onClick={() => {}} style={{ margin: '0 10px' }}>
                  <Link to='/mypage' style={{ color: 'black' }}>MyPage</Link>
                </button>
              </div> : 
              <div style={{ float: 'right' }}>로그인을 해주세요.</div>
            }
            <Header />
            <br/>
            <Switch>
              <Route path='/' exact component={Home} />
              <Route path='/readBest' exact component={Best} />
              <Route path='/login' exact component={Login} />
              <Route path='/signin' exact component={Signin} />
              <Route path='/findPw' exact component={FindPw} />
              <Route path='/createPost' exact component={CreatePost} />
              <Route path='/detail/:id' exact component={DetailPost} />
              <Route path='/updatePost/:id' exact component={CreatePost} />
              <Route path='/mypage' exact component={MyPage} />
              <Route path='/mypage/updatePw' exact component={UpdatePw} />
              <Route path='/mypage/deleteUser' exact component={DeleteUser} />
            </Switch>
          </Router>
          <Footer />
        </Container>
      </React.Fragment>
  );
}

export default App;