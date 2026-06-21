const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const interviewRouter = express.Router();
const upload = require("../middlewares/file.middleware")

/**
 * @route post/api/interview
 * @description Generate a tailored interview preparation report
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReport, async (req, res) => {
    try {
        const { resume, selfDescription, jobDescription } = req.body;
        const report = await generateInterviewReport({ resume, selfDescription, jobDescription });
        res.json(report);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = interviewRouter