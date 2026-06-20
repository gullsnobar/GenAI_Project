const mongoose = require('mongoose');

/**
 * InterviewReport Schema
 * resume text
 * self description
 * 
 * technical questions : []
 * behavioural question : []
 * skills gap : []
 * preparation plan : [{}]
 */

const interviewReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeText: {
        type: String,
        required: true,
        trim: true
    },
    selfDescription: {
        type: String,
        required: true,
        trim: true
    },
    technicalQuestions: [{
        question: { type: String, required: true },
        topic: { type: String },
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] }
    }],
    behaviouralQuestions: [{
        question: { type: String, required: true },
        focusArea: { type: String }
    }],
    skillsGap: [{
        skill: { type: String, required: true },
        reason: { type: String }
    }],
    preparationPlan: [{
        topic: { type: String, required: true },
        actionItems: [{ type: String }],
        estimatedTime: { type: String },
        resources: [{ type: String }]
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('InterviewReport', interviewReportSchema);
