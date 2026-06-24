
const { PDFParse } = require("pdf-parse")
const { generateInterviewReport: generateInterviewReports } = require("../services/ai.service")
const interviewReportModel = require("../model/interviewReport.model")

async function generateInterviewReport(req, res){
    try {
        const resumeFile = req.file
        if (!resumeFile) {
            return res.status(400).json({ message: "Resume file is required" })
        }

        const parser = new PDFParse({ data: req.file.buffer })
        const resumeContent = await parser.getText()
        await parser.destroy()
        const { selfDescription, jobDescription } = req.body

        const interviewReportByAi = await generateInterviewReports({
            resume: resumeContent.text, 
            selfDescription, 
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resumeText: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            data: interviewReport
        })
    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function getInterviewReport(req, res) {
    try {
        const report = await interviewReportModel.findOne({
            _id: req.params.id,
            user: req.user.id
        })
        if (!report) {
            return res.status(404).json({ message: "Report not found" })
        }
        res.status(200).json({ interviewReport: report })
    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function getAllInterviewReports(req, res) {
    try {
        const reports = await interviewReportModel.find({ user: req.user.id, isArchived: false }).sort({ createdAt: -1 })
        res.status(200).json({ interviewReports: reports })
    } catch (error) {
        console.error("Error fetching interview reports:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports = {
    generateInterviewReport,
    getInterviewReport,
    getAllInterviewReports
}