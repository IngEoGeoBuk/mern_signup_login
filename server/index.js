// node index.js
// nodemon --watch index.js

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
import * as config from './Config'

/// DATABASE CONNECTION
mongoose.connect(`mongodb://localhost:27017/uefa?readPreference=primary&appname=MongoDB%20Compass&ssl=false`,
    { useNewUrlParser: true }
);

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24
    }
}))

/// 계정 관련 부분 ///
const userRoute = require('./routes/user');
app.use("/", userRoute);

/// 메일 보내는 부분 ///
const emailRoute = require('./routes/email');
app.use("/", emailRoute);

/// 게시글 부분 ///
const postRoute = require('./routes/post');
app.use("/post", postRoute);

/// 댓글 부분 ///
const commentRoute = require('./routes/comment');
app.use("/comment", commentRoute);

/// 좋아요 && 싫어요 부분 ///
const likeDislikeRoute = require('./routes/likeDislike');
app.use("/likeDislike", likeDislikeRoute);

app.listen(5000, () => {
    console.log("yey, server is running on port 5000");
})

require('dotenv').config();
