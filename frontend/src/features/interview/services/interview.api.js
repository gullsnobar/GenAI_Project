import axios from "axios";

const BASE_URL = "http://localhost:3000/api/interview";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    const response = await api.post("/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const getInterviewReportById = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};

export const getAllInterviewReports = async () => {
    const response = await api.get("/");
    return response.data;
};

export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.get(`/${interviewReportId}/resume-pdf`, {
        responseType: "arraybuffer",
    });
    return response.data;
};
