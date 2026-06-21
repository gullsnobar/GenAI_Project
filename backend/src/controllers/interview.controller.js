
const pdfParse = require("pdf-parse")
const generateInterviewReports = require("../services/ai.service")
async function generateInterviewReport(req, res){

    const resumeFile = req.file
    const resumeContent = await pdfParse(req.file.buffer)
    const { selfDescription, jobDescription } = req.body

    const interviewReportByAi = await generateInterviewReports(resumeContent, selfDescription, jobDescription)

}


module.exports = {
    generateInterviewReport
}