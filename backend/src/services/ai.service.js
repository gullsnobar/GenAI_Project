const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

/**
 * ai.service.js
 *
 * Wraps Gemini structured-output calls used to generate an InterviewReport.
 * Given a candidate's resume, self-description, and a target job description,
 * this asks Gemini to return a JSON object matching `interviewReportSchema` —
 * technical questions, behavioural questions, and skill gaps — which the
 * caller can then save directly onto an InterviewReport document.
 */

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

/**
 * Simple connectivity/sanity check against the Gemini API.
 * Useful for confirming the API key and model name are valid before
 * wiring up the real structured-output call.
 */
async function invokeGeminiAi() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello from Gemini"
    });

    console.log(response.text);
}

/**
 * Shape of the structured report Gemini must return.
 * Mirrors the InterviewReport Mongoose schema's array fields so the
 * response can be saved with minimal transformation.
 */
const interviewReportSchema = z.object({
    technicalQuestions: z
        .array(
            z.object({
                question: z.string().describe("The technical question to ask the candidate"),
                topic: z.string().describe("The technical topic or skill this question targets, e.g. 'MongoDB indexing'"),
                difficulty: z
                    .enum(["Easy", "Medium", "Hard"])
                    .describe("How difficult this question is relative to the seniority implied by the job description"),
                answer: z.string().describe("A strong model answer the candidate should be able to give"),
                intention: z.string().describe("Why this question is being asked — what it reveals about the candidate's fit for the role")
            })
        )
        .describe("Technical questions tailored to the gap between the candidate's resume and the job description"),

    behaviouralQuestions: z
        .array(
            z.object({
                question: z.string().describe("The behavioural/situational question to ask the candidate"),
                focusArea: z.string().describe("The competency this question probes, e.g. 'ownership', 'handling ambiguity', 'conflict resolution'"),
                intention: z.string().describe("What this question is designed to reveal about the candidate, grounded in their self-description or resume")
            })
        )
        .describe("Behavioural questions grounded in specifics from the candidate's resume and self-description, not generic templates"),

    skillsGap: z
        .array(
            z.object({
                skill: z.string().describe("A specific skill or area of knowledge the job requires but the candidate's resume doesn't clearly demonstrate"),
                reason: z.string().describe("Why this is flagged as a gap, citing specifics from the resume and job description"),
                severity: z
                    .enum(["Low", "Medium", "High"])
                    .describe("How critical this gap is relative to the job's core requirements")
            })
        )
        .describe("Skills the job description requires or strongly prefers that the resume does not clearly demonstrate"),

    preparationPlan: z
        .array(
            z.object({
                topic: z.string().describe("A topic or area the candidate should prepare, derived from the skill gaps and job description"),
                actionItems: z
                    .array(z.string())
                    .describe("Concrete, specific actions the candidate should take to prepare on this topic — not generic advice"),
                estimatedTime: z.string().describe("Roughly how long this topic needs, e.g. '2-3 hours', '1 weekend'"),
                resources: z
                    .array(z.string())
                    .describe("Specific resources to use — real courses, docs, repos, or practice platforms relevant to this topic")
            })
        )
        .describe("A structured, prioritized study plan that directly addresses the skill gaps identified above"),

    matchScore: z
        .number()
        .min(0)
        .max(100)
        .describe("Overall fit score between the candidate's resume/self-description and the job description, from 0 to 100")
});

/**
 * Builds the prompt sent to Gemini, embedding the candidate's resume,
 * self-description, and the target job description.
 */
function buildPrompt({ resume, selfDescription, jobDescription }) {
    return `
You are an expert technical interviewer and career coach preparing a candidate
for an upcoming interview.

Use the three inputs below to generate a tailored interview preparation report.
Be specific — reference actual details from the resume, self-description, and
job description rather than generic, boilerplate questions or feedback. Ground
every question and gap in something concrete from the inputs provided.

--- RESUME ---
${resume}

--- CANDIDATE SELF-DESCRIPTION ---
${selfDescription}

--- JOB DESCRIPTION ---
${jobDescription}

Generate a JSON object with exactly these keys:
- "technicalQuestions": Technical questions that probe the specific gap between what the resume demonstrates and what the job description requires.
- "behaviouralQuestions": Behavioural questions grounded in specifics from the resume and self-description (real projects, real decisions, real trade-offs they mentioned) — not generic "tell me about a time" filler.
- "skillsGap": Skill gaps the job requires or strongly prefers that the resume does not clearly demonstrate, with reasoning and a severity rating.
- "preparationPlan": A preparation plan that directly addresses the skill gaps from step 3 — each topic in the plan should map back to a specific gap, with concrete action items, a realistic time estimate, and specific resources (real docs, courses, or practice platforms, not vague suggestions like "read more about it").
- "matchScore": An overall match score from 0–100.
`.trim();
}

/**
 * Generates a structured interview report by calling Gemini with a JSON
 * schema derived from `interviewReportSchema`. Returns a plain object
 * matching that schema, ready to be merged into an InterviewReport document.
 *
 * @param {Object} params
 * @param {string} params.resume - The candidate's resume text.
 * @param {string} params.selfDescription - The candidate's self-description.
 * @param {string} params.jobDescription - The target job description.
 * @returns {Promise<Object>} Parsed report matching interviewReportSchema.
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    if (!resume || !selfDescription || !jobDescription) {
        throw new Error("resume, selfDescription, and jobDescription are all required");
    }

    const jsonSchema = zodToJsonSchema(interviewReportSchema);
    delete jsonSchema.$schema;

    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: buildPrompt({ resume, selfDescription, jobDescription }),
        config: {
            responseMimeType: "application/json",
            responseSchema: jsonSchema
        }
    });

    let parsed;
    try {
        console.log("Raw Gemini Response:", response.text);
        parsed = JSON.parse(response.text);
    } catch (err) {
        throw new Error(`Failed to parse Gemini response as JSON: ${err.message}`);
    }

    const result = interviewReportSchema.safeParse(parsed);
    if (!result.success) {
        throw new Error(`Gemini response did not match expected schema: ${result.error.message}`);
    }

    return result.data;
}

module.exports = {
    invokeGeminiAi,
    generateInterviewReport,
    interviewReportSchema
};