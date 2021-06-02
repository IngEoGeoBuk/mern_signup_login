const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    poId: {
        type: String,
        required: true
    }
});

const LikeModel = mongoose.model('like', LikeSchema);

module.exports = LikeModel;