const mongoose = require("mongoose")

try {
    async function connectToDB(){
    await mongoose.connect(process.env.MONGO_URI)
    console.log("DB is Connected")
}

} catch (error) {
    console.error("Error connecting to DB:", error)
}

module.exports = connectToDB