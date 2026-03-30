const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Succesful connection to mongoDB");
    } catch {
        console.error("Error: Connection MongoDB");
        process.exit(1); //Stop process
    }
}

module.exports = connectDB;