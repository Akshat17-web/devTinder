const express = require("express");
const {UserAuth} = require("./middlewares/auth")

const app = express();

const connectDB = require("./config/database");

const {User} = require("./models/user");

const {validateSignUpData} = require("./utils/validation")

const bcrypt = require("bcrypt");

const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");

app.use(express.json());

app.use(cookieParser());

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
        const user = await User.findOne({emailId : emailId}).exec();
        if(!user){
            throw new Error("Email is NOT yet registered, please Signup first!");
        }
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            // Create a JWT Token:
            // const token = await jwt.sign({_id: user._id}, "Piyush11", {expiresIn: "1d"});
            const token = await user.getJWT();
            // user_id is hided data, Piyush11 is the secret key
            console.log(token);

            res.cookie('token', token, {expires: new Date(Date.now() + 60000)});
            // Cookie expire time = 10 secs 
            res.send("Login Successful");
        }else{
            throw new Error("Incorrect password, please try again")
        }
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

// After adding userAuth middleware, many redundant code could be deleted, which are already been done in userAuth
app.get("/profile", UserAuth, async (req, res) => {
    try{
        // const cookies = req.cookies;
        // console.log(cookies);
        // const { token } = cookies;
        // if(!token){
        //     throw new Error("Invalid Token");
        // }

        // // Validate my tokens
        // const decodedMessage = await jwt.verify(token, "Piyush11"); 
        // const {_id} = decodedMessage;
        // console.log("Logged In user is: " + _id);

        // const user = await User.findById(_id);
        // if(!user){
        //     throw new Error("User does NOT exist");
        // }/
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/sendConnectionRequest", UserAuth, async (req, res) => {
    console.log("Sending connection request");
    const user = req.user;
    res.send("Connection request sent by: "+user.firstName);
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