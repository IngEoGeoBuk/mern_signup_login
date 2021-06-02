// node index.js
// nodemon --watch index.js

const express = require('express');
const app = express();
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const UserModel = require('./models/User');

/// DATABASE CONNECTION
mongoose.connect(`mongodb://localhost:27017/uefa?readPreference=primary&appname=MongoDB%20Compass&ssl=false`, 
    { useNewUrlParser: true }
);

/// 회원가입 부분 ///

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);
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

app.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            console.log(err)
        }
        const user = new UserModel({
            email, password: hash
        });

        user.save()
        res.send(user);

    })
});

app.get('/readUsers', async (req, res) => {
    await UserModel.find({}, { email: 1 }, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

/// 이메일 보내는 부분


// async..await is not allowed in global scope, must use a wrapper
app.post('/sendEmail', (req, res) => {

    const email = req.body.email;
    const value = req.body.value;

    async function main() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Naver',
        host: "smtp.naver.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: 'burning19@naver.com', // generated ethereal user
        pass: 'put your password', // generated ethereal password
        },
    });
    
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Nodemailer contact" <burning19@naver.com>', // sender address
        to: `${email}`, // list of receivers
        subject: '회원가입 인증 번호입니다.', // Subject line
        text: "회원가입 인증번호를 입력해주세요", // plain text body
        html: `인증번호는 ${value} 입니다.`, // html body
    });
    
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    
    main().catch(console.error);
})

/// 회원가입 부분 끝 ///


/// 로그인 부분 ///
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    await UserModel.find({ "email" : email }, (err, result) => {
        if(err) {
            res.send({ 'err' : err })
        }  
        if(result.length > 0) {
            bcrypt.compare(password, result[0].password, 
                (error, response) => {
                    if(response) {
                        const id = result[0].id
                        const token = jwt.sign({id}, "jwtSecret", {
                            expiresIn: 300
                        })
                        req.session.user = result;
                        res.json({ auth: true, token, result });
                    } else {
                        res.json({ auth: false, message: "wrong username || password" });
                    }
                }    
            )
        } else {
            res.json({ auth: false, message: "no user exists" });
        }        
    })
})

/// 로그인 부분 끝 ///


/// 비밀번호 수정 및 회원탈퇴, 비번찾기(초기화) ///
app.put('/updatePw', (req, res) => {
    const id = req.body.id;
    const password = req.body.newPassword;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            console.log(err);
        }
        try {
            UserModel.findById(id, (error, updatePw) => {
                updatePw.password = hash;
                updatePw.save();
            })
        } catch (error) {
            console.log(err)
        }
        res.send('update');
    })
});

app.delete("/deleteUser/:id", async (req, res) => {
    const id = req.params.id;
    await UserModel.findByIdAndRemove(id).exec()
    res.send("user deleted");
})

app.get("/readUser/:email", async (req, res) => {
    const email = req.params.email;
    await UserModel.find({ "email" : email}, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

/// 비밀번호 수정 및 회원탈퇴, 비번찾기(초기화) 끝 ///


/// 게시글 부분 ///
const PostModel = require('./models/Post');

app.post('/createPost', async (req, res) => {
    const email = req.body.email;
    const title = req.body.title;
    const contents = req.body.contents;
    const time = req.body.time;

    const post = new PostModel({
        email, title, contents, time
    });
    
    await post.save()
    res.send(post);
})

app.get('/readPost', async (req, res) => {
    await PostModel.find({}, { _id: 1, title: 1 }, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/readOne/:id', async (req, res) => {
    const id = req.params.id;
    await PostModel.find({ "_id": id }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

app.put("/updatePost/:id", async (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const contents = req.body.contents;
    const updated_time = req.body.time;

    try {
        await PostModel.findById(id, (err, updatePost) => {
            updatePost.title = String(title);
            updatePost.contents = String(contents);
            updatePost.updated_time = String(updated_time);
            updatePost.save();
        })
    } catch (error) {
        console.log(error)
    }
})

app.delete("/deletePost/:id", async (req, res) => {
    const id = req.params.id
    await PostModel.findByIdAndRemove(id).exec()
    res.send("item deleted.");
});
/// 게시글 부분 끝 /// 


/// 댓글 부분 ///
const CommentModel = require('./models/Comment');

app.post('/createComment', async (req, res) => {
    const poId = req.body.poId;
    const email = req.body.email;
    const context = req.body.context;
    const time = req.body.time;
    const comment = new CommentModel({
        poId, email, context, time
    });
    await comment.save()
    res.send(comment);
});

app.get('/readComment/:id', async (req, res) => {
    const id = req.params.id;
    await CommentModel.find({ "poId" : id }, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

app.put("/updateComment/:updateTargetCommentId", async (req, res) => {
    const updateTargetCommentId = req.params.updateTargetCommentId;
    const context = req.body.newContext;
    const time = req.body.time;
    try {
        await CommentModel.findById(updateTargetCommentId, (error, updateComment) => {
            updateComment.context = String(context);
            updateComment.updated_time = String(time);
            updateComment.save();
        })
    } catch (err) {
        console.log(err)
    }
    res.send('updated');
});

app.delete("/deleteComment/:id", async (req, res) => {
    const id = req.params.id;
    await CommentModel.findByIdAndRemove(id).exec()
    res.send("item deleted.");   
});
/// 댓글 부분 끝 ///


/// 좋아요 && 싫어요 부분 ///
const LikeModel = require('./models/Like');
const DislikeModel = require('./models/Dislike');

app.post('/upLike', async (req, res) => {
    const poId = req.body.poId;
    const email = req.body.email;
    const uplike = new LikeModel({
        poId, email
    });
    await uplike.save()
    res.send(uplike);
});

app.post('/unLike', async (req, res) => {
    const id = req.body.yourLiked;
    await LikeModel.findOneAndDelete(id).exec()
    res.send("liked deleted.");    
});

app.get('/readYourLike/:poId/:email', async (req, res) => {
    const email = req.params.email;
    const poId = req.params.poId;
    let variable = { email, poId }
    await LikeModel.find(variable, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

app.post('/upDislike', async (req, res) => {
    const poId = req.body.poId;
    const email = req.body.email;
    const updislike = new DislikeModel({
        poId, email
    });
    await updislike.save()
    res.send(updislike);
});

app.post('/unDislike', async (req, res) => {
    const id = req.body.yourDisliked;
    await DislikeModel.findOneAndDelete(id).exec()
    res.send("disliked deleted.");    
});

app.get('/readYourDislike/:poId/:email', async (req, res) => {
    const email = req.params.email;
    const poId = req.params.poId;
    let variable = { email, poId }
    await DislikeModel.find(variable, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/ReadLike/:poId', async (req, res) => {
    const poId = req.params.poId;
    await LikeModel.find({ poId }, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

app.get('/ReadDislike/:poId', async (req, res) => {
    const poId = req.params.poId;
    await DislikeModel.find({ poId }, (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

/// 좋아요 && 싫어요 부분 끝 ///


/// 개념글 부분 ///
app.get('/readBest', async (req, res) => {
    // 념글컷 조정하고 싶으면 $gt: 3 <--- 이거 건드리자
    await LikeModel.aggregate([{ $group: {
        _id: { poId: "$poId" },
        count: { $sum: 1 }}},
        { $match: {
            count: { $gt: 2 }}},
        { $project: {
            _id: 0,
            poId: "$_id.poId",
            count: 1 }
        }
    ], (err, result) => {
        if(err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

/// 개념글 부분 끝 ///

app.listen(5000, () => {
    console.log("yey, server is running on port 5000");
})

require('dotenv').config();
