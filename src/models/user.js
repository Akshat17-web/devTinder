const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4 // Name shorter than 3 letters not allowed
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true, // For compulsory fields
        unique: true, // For fields which cannote be common in two user
        lowercase: true,// Make whole string in lowercase(If uppercase entered then also its converted)
        trim: true // Remove any space before or after email body, If there.
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18 // This works only during inserting new data, we can update a existing one without following this
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].include(value)){
                throw new Error("Gender data is NOT valid");
            }
        } // This function will only work on insertion, not on updation. (Without runValidators)
    },
    photourl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
    },
    about : {
        type: String,
        default: "Hey, lets connect!"
    },
    skills : {
        type: [String]
    }
}, {
    timestamps: true
});

// "U" of User should always be capital
const User = mongoose.model("User", userSchema);

module.exports = User;