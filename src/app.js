const express = require("express");

const app = express();

//This will only handle GET call to to /test
app.get("/test",(req, res) => {
    res.send({firstname: "Akshat", lastname: "Piyush"});
});

app.post("/test",(req, res) => {
    res.send("Data saved successfull to the database.");
});

//This will match all the HTTP method API calls to /test
app.use("/test",(req, res) => {
    res.send("Hello check, hello");
});


app.use((req, res) => {
    res.send("Hello from the server");
});

app.listen(3000, ()=>{
    console.log("Server is listening on port 3000");
});