package com.exam.dto;

import com.exam.model.exam.ExamStatus;
import com.exam.oop.strategy.GradingStrategyType;

import java.util.ArrayList;
import java.util.List;

public class CreateExamRequest {

    private String title;
    private String description;
    private String subject;
    private String instructorId;
    private String instructorName;
    private int durationMinutes = 30;
    private double passingPercentage = 50.0;
    private ExamStatus status = ExamStatus.ACTIVE;
    private GradingStrategyType gradingStrategyType = GradingStrategyType.STRICT;
    private String instructions;
    private List<QuestionDto> questions = new ArrayList<>();

    public CreateExamRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(String instructorId) {
        this.instructorId = instructorId;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public double getPassingPercentage() {
        return passingPercentage;
    }

    public void setPassingPercentage(double passingPercentage) {
        this.passingPercentage = passingPercentage;
    }

    public ExamStatus getStatus() {
        return status;
    }

    public void setStatus(ExamStatus status) {
        this.status = status;
    }

    public GradingStrategyType getGradingStrategyType() {
        return gradingStrategyType;
    }

    public void setGradingStrategyType(GradingStrategyType gradingStrategyType) {
        this.gradingStrategyType = gradingStrategyType;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public List<QuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDto> questions) {
        this.questions = questions;
    }
}
