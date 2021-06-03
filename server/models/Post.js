const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    time: {
        type: String,
        required: true
    },
    updated_time: {
        type: String,
        required: false
    }
});

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;