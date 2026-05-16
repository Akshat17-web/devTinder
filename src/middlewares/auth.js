const jwt = require("jsonwebtoken");
const {User} = require("../models/user");
const AdminAuth = (req, res, next)=>{
    console.log("Admin Auth is getting checked");
    const token = "xyz";
    const isadminauthorized = token === "xoyz";
    if(!isadminauthorized){
        res.status(401).send("Unauthorized access");
    }else{
        next();
    }
}
const UserAuth = async(req, res, next)=>{
    try{
        const { token } = req.cookies;
        if(!token){
            throw new Error("Token is NOT valid");
        }
        const decodedObj = await jwt.verify(token, "Piyush11");
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User NOT found");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
}
module.exports = {
    UserAuth
}