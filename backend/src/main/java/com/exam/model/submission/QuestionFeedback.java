package com.exam.model.submission;

import com.exam.model.question.QuestionType;

/**
 * Encapsulated detailed question feedback generated post-evaluation.
 */
public class QuestionFeedback {

    private String questionId;
    private String questionText;
    private QuestionType questionType;
    private Object studentAnswerSummary;
    private String correctSolution;
    private boolean isCorrect;
    private double marksAwarded;
    private double maxMarks;
    private String feedback;
    private String explanation;

    public QuestionFeedback() {}

    public QuestionFeedback(String questionId, String questionText, QuestionType questionType,
                            Object studentAnswerSummary, String correctSolution, boolean isCorrect,
                            double marksAwarded, double maxMarks, String feedback, String explanation) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.questionType = questionType;
        this.studentAnswerSummary = studentAnswerSummary;
        this.correctSolution = correctSolution;
        this.isCorrect = isCorrect;
        this.marksAwarded = marksAwarded;
        this.maxMarks = maxMarks;
        this.feedback = feedback;
        this.explanation = explanation;
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public QuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(QuestionType questionType) {
        this.questionType = questionType;
    }

    public Object getStudentAnswerSummary() {
        return studentAnswerSummary;
    }

    public void setStudentAnswerSummary(Object studentAnswerSummary) {
        this.studentAnswerSummary = studentAnswerSummary;
    }

    public String getCorrectSolution() {
        return correctSolution;
    }

    public void setCorrectSolution(String correctSolution) {
        this.correctSolution = correctSolution;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    public double getMarksAwarded() {
        return marksAwarded;
    }

    public void setMarksAwarded(double marksAwarded) {
        this.marksAwarded = marksAwarded;
    }

    public double getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(double maxMarks) {
        this.maxMarks = maxMarks;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
