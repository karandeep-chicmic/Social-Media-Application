const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    friends: {
        type: Array,
        default: [],
        required: true
    }
},{
    timestamps: true
})