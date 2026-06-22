const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const interviewRouter = express.Router();
const upload = require("../middlewares/file.middleware")

/**
 * @route POST /api/interview
 * @description Generate a tailored interview preparation report
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReport);

module.exports = interviewRouter