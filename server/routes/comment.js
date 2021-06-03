const router = require("express").Router();
const CommentModel = require('../models/Comment');

router.post('/createComment', async (req, res) => {
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

router.get('/readComment/:id', async (req, res) => {
    const id = req.params.id;
    await CommentModel.find({ "poId": id }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    })
})

router.put("/updateComment/:updateTargetCommentId", async (req, res) => {
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

router.delete("/deleteComment/:id", async (req, res) => {
    const id = req.params.id;
    await CommentModel.findByIdAndRemove(id).exec()
    res.send("item deleted.");
});

module.exports = router;