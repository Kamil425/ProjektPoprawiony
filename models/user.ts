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
    OstatniaAktywnosc:{
        type:Date,
        required:true,
    },
<<<<<<< Updated upstream
=======
    OstatniaAktywnosc:{
        type:Date,
        required:true,
    },
>>>>>>> Stashed changes
    powiadomieniaWyslane:{
        type: Number,
    },
       
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes

}, {timestamps: true});

const User = models.User || mongoose.model("User", userSchema);
export default User;