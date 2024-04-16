const { Schema, model, default: mongoose } = require('mongoose');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageUrl: {
        type: String,
        required: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true });

module.exports = model('Blog', blogSchema);