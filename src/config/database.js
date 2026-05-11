const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://akshatpiyush07:d16uO1mrvVYfVlWV@namastenodejs.iulpoq9.mongodb.net/devTinder"
    );
};

module.exports = connectDB; 