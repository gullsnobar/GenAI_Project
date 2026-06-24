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

/**
 * @route GET /api/interview
 * @description Get all interview reports for logged-in user
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReports);

/**
 * @route GET /api/interview/:id
 * @description Get a single interview report by ID
 * @access private
 */
interviewRouter.get("/:id", authMiddleware.authUser, interviewController.getInterviewReport);

module.exports = interviewRouter