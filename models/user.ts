import mongoose, { models } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    quizResults: {
        type: Array,
        required: false,
    },

}, {timestamps: true});

const User = models.User || mongoose.model("User", userSchema);
export default User;