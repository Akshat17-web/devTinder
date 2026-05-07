const express = require("express");
const {AdminAuth, UserAuth} = require("./middlewares/auth")
const app = express();

app.use("/admin", AdminAuth)
app.get("/admin/getalldata", (req, res)=>{
    res.send("All data sent");
});
app.get("/admin/deleteuser", (req, res)=>{
    res.send("User deleted");
});

app.get("/user", UserAuth, (req, res)=>{
    res.send("User Authenticated and signed");
});

app.listen(3000, ()=>{
    console.log("Server is listening on port 3000");
});