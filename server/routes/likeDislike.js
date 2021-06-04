const router = require("express").Router();
const LikeModel = require('../models/Like');
const DislikeModel = require('../models/Dislike');

router.post('/upLike', async (req, res) => {
    const poId = req.body.poId;
    const email = req.body.email;
    const uplike = new LikeModel({
        poId, email
    });
    await uplike.save()
    res.send(uplike);
});

router.delete('/unLike/:yourLiked', async (req, res) => {
    const id = req.params.yourLiked
    await LikeModel.findOneAndDelete({ "_id": id }).exec()
    res.send("liked deleted.");
});

router.get('/readYourLike/:poId/:email', async (req, res) => {
    const email = req.params.email;
    const poId = req.params.poId;
    let variable = { email, poId }
    await LikeModel.find(variable, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get('/ReadLike/:poId', async (req, res) => {
    const poId = req.params.poId;
    await LikeModel.find({ poId }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.post('/upDislike', async (req, res) => {
    const poId = req.body.poId;
    const email = req.body.email;
    const updislike = new DislikeModel({
        poId, email
    });
    await updislike.save()
    res.send(updislike);
});

router.delete('/unDislike/:yourDisliked', async (req, res) => {
    const id = req.params.yourDisliked
    await DislikeModel.findOneAndDelete({ "_id": id }).exec()
    res.send("disliked deleted.");
});

router.get('/readYourDislike/:poId/:email', async (req, res) => {
    const email = req.params.email;
    const poId = req.params.poId;
    let variable = { email, poId }
    await DislikeModel.find(variable, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get('/ReadDislike/:poId', async (req, res) => {
    const poId = req.params.poId;
    await DislikeModel.find({ poId }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

module.exports = router;