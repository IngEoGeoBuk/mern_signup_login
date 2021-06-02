const mongoose = require("mongoose");

const DislikeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    poId: {
        type: String,
        required: true
    }
});

const DislikeModel = mongoose.model('Dislike', DislikeSchema);

module.exports = DislikeModel;