const router = require("express").Router();
const PostModel = require('../models/Post');

router.post('/createPost', async (req, res) => {
    const email = req.body.email;
    const title = req.body.title;
    const contents = req.body.contents;
    const image = req.body.image;
    const time = req.body.time;

    const post = new PostModel({
        email, title, contents, image, time
    });

    await post.save()
    res.send(post);
})

router.get('/readPost', async (req, res) => {
    await PostModel.find({}, { _id: 1, title: 1 }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.get('/readOne/:id', async (req, res) => {
    const id = req.params.id;
    await PostModel.find({ "_id": id }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.put("/updatePost/:id", async (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const contents = req.body.contents;
    const image = req.body.image;
    const updated_time = req.body.time;

    try {
        await PostModel.findById(id, (err, updatePost) => {
            if(image) {
                updatePost.title = String(title);
                updatePost.contents = String(contents);
                updatePost.image = String(image);
                updatePost.updated_time = String(updated_time);
            } else {
                updatePost.title = String(title);
                updatePost.contents = String(contents);
                updatePost.updated_time = String(updated_time);
            }
            updatePost.save();
        })
    } catch (error) {
        console.log(error)
    }
})

router.delete("/deletePost/:id", async (req, res) => {
    const id = req.params.id
    await PostModel.findByIdAndRemove(id).exec()
    res.send("item deleted.");
});


/// 개념글 부분 ///
const LikeModel = require('../models/Like');
router.get('/readBest', async (req, res) => {
    // 념글컷 조정하고 싶으면 $gt: 3 <--- 이거 건드리자
    await LikeModel.aggregate([{
        $group: {
            _id: { poId: "$poId" },
            count: { $sum: 1 }
        }
    },
    {
        $match: {
            count: { $gt: 1 }
        }
    },
    {
        $project: {
            _id: 0,
            poId: "$_id.poId",
            count: 1
        }
    }
    ], (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})
/// 개념글 부분 끝 ///



module.exports = router;