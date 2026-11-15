package com.exam.model.submission;

import java.util.ArrayList;
import java.util.List;

/**
 * Encapsulates a candidate's answer for a single question.
 * Supports multiple formats polymorphically handled by questions.
 */
public class StudentAnswer {

    private String questionId;
    private List<Integer> selectedOptionIndices = new ArrayList<>();
    private Boolean booleanAnswer;
    private String textAnswer;
    private String codeAnswer;

    public StudentAnswer() {}

    public StudentAnswer(String questionId) {
        this.questionId = questionId;
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public List<Integer> getSelectedOptionIndices() {
        return selectedOptionIndices;
    }

    public void setSelectedOptionIndices(List<Integer> selectedOptionIndices) {
        this.selectedOptionIndices = selectedOptionIndices;
    }

    public Boolean getBooleanAnswer() {
        return booleanAnswer;
    }

    public void setBooleanAnswer(Boolean booleanAnswer) {
        this.booleanAnswer = booleanAnswer;
    }

    public String getTextAnswer() {
        return textAnswer;
    }

    public void setTextAnswer(String textAnswer) {
        this.textAnswer = textAnswer;
    }

    public String getCodeAnswer() {
        return codeAnswer;
    }

    public void setCodeAnswer(String codeAnswer) {
        this.codeAnswer = codeAnswer;
    }

    public boolean isAttempted() {
        return (selectedOptionIndices != null && !selectedOptionIndices.isEmpty())
                || booleanAnswer != null
                || (textAnswer != null && !textAnswer.trim().isEmpty())
                || (codeAnswer != null && !codeAnswer.trim().isEmpty());
    }
}
