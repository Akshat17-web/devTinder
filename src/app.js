const express = require("express");
const {AdminAuth, UserAuth} = require("./middlewares/auth")

const app = express();

const connectDB = require("./config/database");


const User = require("./models/user");

app.use(express.json());

app.post("/test",(req, res) => {
    res.send("Data saved successfull to the database.");
});

app.post("/signup", async (req, res) => {
    const userObj = req.body;
    const user = new User(userObj);
    console.log(req.body);
    try{
        await user.save();
        res.send("User added successfully!");
    }catch (err){
        res.status(400).send("Error saving the user: " + err.message);
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