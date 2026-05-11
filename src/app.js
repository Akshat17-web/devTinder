const express = require("express");
const {AdminAuth, UserAuth} = require("./middlewares/auth")

const app = express();

const connectDB = require("./config/database");


const User = require("./models/user");

app.post("/test",(req, res) => {
    res.send("Data saved successfull to the database.");
});

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName : "Virat",
        lastName : "Kohli",
        emailId : "kohli_gamer@gmail.com",
        password : "66646"
    };
    const user = new User(userObj);
    try{
        await user.save();
        res.send("User added successfully!");
    }catch (err){
        res.status(400).send("Error saing the user: " + err.message);
    }
});

connectDB() 
    .then(() => {
        console.log("Database connection established");
        app.listen(3000, ()=>{
        console.log("Server is listening on port 3000");
    });
    })
    .catch((err) => {
        console.error("Database cannot be connected!!");
    });