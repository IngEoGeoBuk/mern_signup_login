const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    poId: {
        type: String,
        required: true
    },
    coId: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    context: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    updated_time: {
        type: String,
        required: false
    },
});

const CommentModel = mongoose.model('comment', CommentSchema);

module.exports = CommentModel;