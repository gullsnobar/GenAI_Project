const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * InterviewReport Schema
 *
 * Stores an AI-generated interview prep report:
 * - resume text & self description (raw inputs)
 * - job match score
 * - technical / behavioural questions
 * - identified skill gaps
 * - a structured preparation plan
 */

const technicalQuestionSchema = new Schema({
    question: { type: String, required: true, trim: true },
    topic: { type: String, trim: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    answered: { type: Boolean, default: false },
    userNotes: { type: String, trim: true }
}, { _id: true });

const behaviouralQuestionSchema = new Schema({
    question: { type: String, required: true, trim: true },
    focusArea: { type: String, trim: true },
    answered: { type: Boolean, default: false },
    userNotes: { type: String, trim: true }
}, { _id: true });

const skillGapSchema = new Schema({
    skill: { type: String, required: true, trim: true },
    reason: { type: String, trim: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
}, { _id: false });

const preparationPlanSchema = new Schema({
    topic: { type: String, required: true, trim: true },
    actionItems: [{ type: String, trim: true }],
    estimatedTime: { type: String, trim: true },
    resources: [{ type: String, trim: true }],
    completed: { type: Boolean, default: false }
}, { _id: true });

const interviewReportSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    jobTitle: {
        type: String,
        trim: true
    },
    companyName: {
        type: String,
        trim: true
    },
    jobDescription: {
        type: String,
        required: [true, 'Job description is required'],
        trim: true
    },
    resumeText: {
        type: String,
        required: [true, 'Resume text is required'],
        trim: true
    },
    selfDescription: {
        type: String,
        required: [true, 'Self description is required'],
        trim: true
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviouralQuestions: [behaviouralQuestionSchema],
    skillsGap: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    status: {
        type: String,
        enum: ['draft', 'generating', 'completed', 'failed'],
        default: 'draft',
        index: true
    },
    generationError: {
        type: String,
        trim: true
    },
    aiModel: {
        type: String,
        trim: true
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Common compound query: "this user's reports, newest first, excluding archived"
interviewReportSchema.index({ user: 1, createdAt: -1 });
interviewReportSchema.index({ user: 1, isArchived: 1 });

module.exports = mongoose.model('InterviewReport', interviewReportSchema);