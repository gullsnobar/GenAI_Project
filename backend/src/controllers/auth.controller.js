const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../model/blacklist.model")


/**
* @name registerUserController
* @description register a new user, expects username, email, and password
* @access Public
*/

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            });
        }

        // Check if user already exists
        const isUserAlreadyExist = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExist) {
            return res.status(400).json({
                message: "User with this username or email already exists"
            });
        }

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // Create user
        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        // Create Token
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRETS, {
            expiresIn: "1d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

/**
* @name loginUserController
* @description login an existing user, expects email and password
* @access Public
*/

async function loginUserController(req, res){
    const {email, password} = req.body

    const user = await userModel.findOne({ email })

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRETS,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
        token
    });
}

async function logoutUserController(req, res) {
    const token = req.cookies.token

    if(token) {
        // Add token to blacklist
        await tokenBlacklistModel.create({ token })
        // Clear token from cookie
        res.clearCookie("token")
    }

    res.json({ message: "Logged out successfully" })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access Private
 */

async function getMeController(req, res){

    const user = await userModel.findById(req.user.id) 
    res.status(200).json({
        message: "User details retrieved successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    getMeController,
    logoutUserController
};
    
