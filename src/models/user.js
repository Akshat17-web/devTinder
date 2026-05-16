const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50 // Name shorter than 3 letters not allowed
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true, // For compulsory fields
        unique: true, // For fields which cannote be common in two user
        lowercase: true,// Make whole string in lowercase(If uppercase entered then also its converted)
        trim: true, // Remove any space before or after email body, If there.
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password")
            }
        }
    },
    age: {
        type: Number,
        min: 18 // This works only during inserting new data, we can update a existing one without following this
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is NOT valid");
            }
        } // This function will only work on insertion, not on updation. (Without runValidators)
    },
    photourl: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL")
            }
        }
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

userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({_id: user._id}, "Piyush11", {expiresIn: "1d"});
    return token;
};

userSchema.methods.validatePassword = async function (passwordIpByUser){
    const hashPassword = this.password;
    const isPasswordValid = await bcrypt.compare(passwordIpByUser, hashPassword);
    return isPasswordValid;

}
// "U" of User should always be capital
const User = mongoose.model("User", userSchema);

module.exports = {User};