const router = require("express").Router();
const UserModel = require('../models/User');

const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err)
        }
        const user = new UserModel({
            email, password: hash
        });

        user.save()
        res.send(user);

    })
});

router.get('/readUsers', async (req, res) => {
    await UserModel.find({}, { email: 1 }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})
/// 회원가입 부분 끝 ///


/// 로그인 부분 ///
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    await UserModel.find({ "email": email }, (err, result) => {
        if (err) {
            res.send({ 'err': err })
        }
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password,
                (error, response) => {
                    if (response) {
                        const id = result[0].id
                        const token = jwt.sign({ id }, "jwtSecret", {
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
router.put('/updatePw', (req, res) => {
    const id = req.body.id;
    const password = req.body.newPassword;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
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

router.delete("/deleteUser/:id", async (req, res) => {
    const id = req.params.id;
    await UserModel.findByIdAndRemove(id).exec()
    res.send("user deleted");
})

router.get("/readUser/:email", async (req, res) => {
    const email = req.params.email;
    await UserModel.find({ "email": email }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

/// 비밀번호 수정 및 회원탈퇴, 비번찾기(초기화) 끝 ///
module.exports = router;