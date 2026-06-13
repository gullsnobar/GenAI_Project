const userModel = require("../models/user.model")

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        const user = new userModel({
            username,
            email,
            password
        })

        await user.save()

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        })
    }
}