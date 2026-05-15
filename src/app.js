const express = require("express");
const {AdminAuth, UserAuth} = require("./middlewares/auth")

const app = express();

const connectDB = require("./config/database");

const User = require("./models/user");

app.use(express.json());

const {validateSignUpData} = require("./utils/validation")

const bcrypt = require("bcrypt");

app.post("/test",(req, res) => {
    res.send("Data saved successfull to the database.");
});

app.post("/signup", async (req, res) => {
    try{
        // Validation of data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password, skills} = req.body;
        //Encrypt the password
        const passwordHash = await bcrypt.hash
        (password, 10);
        console.log(passwordHash);

        // Creating a new instance of the User model
        const user = new User(
            {   firstName,
                lastName,
                emailId,
                password: passwordHash,
                skills,
            }
        );

        await user.save();
        res.send("User added successfully!");
    }catch (err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Email is NOT yet registered, please Signup first!");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            res.send("Login Successful");
        }else{
            throw new Error("Incorrect password, please try again")
        }
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

app.get("/user", async (req, res) => {
    const usermail = req.body.emailId;
    try{
        const user = await User.find({emailId : usermail});
        res.send(user);
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }catch{
        res.status(400).send("Something went wrong");
    }
})

app.delete("/del", async (req, res) => {
    const userId = req.body.userId;
    try{
        // const user = await User.find({firstName: userName});
        const user = await User.findOneAndDelete({ _id: userId });
        res.send("User deleted successfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

app.patch("/user/:userId", async (req, res) => {
    const data = req.body;
    const userId = req.params?.userId;
    try{
        const ALLOWED_UPDATES = [
            "photourl",
            "about",
            "gender",
            "age",
            "skills"
        ];
        const isUpdateAllowed = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length > 15){
            throw new Error("Skills can't be more than 15");
        }
        const user = await User.findByIdAndUpdate({ _id: userId}, data, {
            returnDocument: "before",
            runValidators : true});
        res.send("User updated successfully");
        console.log(user);
    }catch(err){
        res.status(400).send("Update failed: "+ err.message);
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