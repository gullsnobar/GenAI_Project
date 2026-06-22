
const pdfParse = require("pdf-parse")
const { generateInterviewReport: generateInterviewReports } = require("../services/ai.service")
const interviewReportModel = require("../model/interviewReport.model")

async function generateInterviewReport(req, res){
    try {
        const resumeFile = req.file
        if (!resumeFile) {
            return res.status(400).json({ message: "Resume file is required" })
        }

        const resumeContent = await pdfParse(req.file.buffer)
        const { selfDescription, jobDescription } = req.body

        const interviewReportByAi = await generateInterviewReports({
            resume: resumeContent.text, 
            selfDescription, 
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            userId: req.user.id,
            resume: resumeContent.text,
            content: interviewReportByAi,
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

module.exports = {
    generateInterviewReport
}