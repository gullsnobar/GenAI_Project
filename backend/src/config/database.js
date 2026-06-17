const mongoose = require("mongoose");

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("DB Connected Successfully");
    } catch (error) {
        console.error("Error connecting to DB:", error);
        process.exit(1);
    }
}

module.exports = connectToDB;