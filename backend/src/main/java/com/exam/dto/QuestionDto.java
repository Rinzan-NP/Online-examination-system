package com.exam.dto;

import com.exam.model.question.QuestionOption;
import com.exam.model.question.QuestionType;
import com.exam.model.question.TestCase;

import java.util.List;

public class QuestionDto {

    private String id;
    private String text;
    private QuestionType questionType;
    private double marks = 1.0;
    private double penaltyMarks = 0.25;
    private String explanation;
    private String difficulty = "MEDIUM";
    private String topic;

    // MCQ specific
    private List<QuestionOption> options;
    private boolean allowMultiple;

    // True/False specific
    private Boolean booleanAnswer;

    // Short answer specific
    private String modelAnswer;
    private List<String> acceptedKeywords;
    private boolean caseSensitive;

    // Coding specific
    private String language;
    private String starterCode;
    private String expectedSolution;
    private List<TestCase> testCases;

    public QuestionDto() {}

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public QuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(QuestionType questionType) {
        this.questionType = questionType;
    }

    public double getMarks() {
        return marks;
    }

    public void setMarks(double marks) {
        this.marks = marks;
    }

    public double getPenaltyMarks() {
        return penaltyMarks;
    }

    public void setPenaltyMarks(double penaltyMarks) {
        this.penaltyMarks = penaltyMarks;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public List<QuestionOption> getOptions() {
        return options;
    }

    public void setOptions(List<QuestionOption> options) {
        this.options = options;
    }

    public boolean isAllowMultiple() {
        return allowMultiple;
    }

    public void setAllowMultiple(boolean allowMultiple) {
        this.allowMultiple = allowMultiple;
    }

    public Boolean getBooleanAnswer() {
        return booleanAnswer;
    }

    public void setBooleanAnswer(Boolean booleanAnswer) {
        this.booleanAnswer = booleanAnswer;
    }

    public String getModelAnswer() {
        return modelAnswer;
    }

    public void setModelAnswer(String modelAnswer) {
        this.modelAnswer = modelAnswer;
    }

    public List<String> getAcceptedKeywords() {
        return acceptedKeywords;
    }

    public void setAcceptedKeywords(List<String> acceptedKeywords) {
        this.acceptedKeywords = acceptedKeywords;
    }

    public boolean isCaseSensitive() {
        return caseSensitive;
    }

    public void setCaseSensitive(boolean caseSensitive) {
        this.caseSensitive = caseSensitive;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getStarterCode() {
        return starterCode;
    }

    public void setStarterCode(String starterCode) {
        this.starterCode = starterCode;
    }

    public String getExpectedSolution() {
        return expectedSolution;
    }

    public void setExpectedSolution(String expectedSolution) {
        this.expectedSolution = expectedSolution;
    }

    public List<TestCase> getTestCases() {
        return testCases;
    }

    public void setTestCases(List<TestCase> testCases) {
        this.testCases = testCases;
    }
}
