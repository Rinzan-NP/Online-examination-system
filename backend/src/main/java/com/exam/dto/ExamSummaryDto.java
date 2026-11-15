package com.exam.dto;

import com.exam.model.exam.ExamStatus;
import com.exam.oop.strategy.GradingStrategyType;

public class ExamSummaryDto {

    private String id;
    private String title;
    private String description;
    private String subject;
    private String instructorName;
    private int durationMinutes;
    private double passingPercentage;
    private ExamStatus status;
    private GradingStrategyType gradingStrategyType;
    private int questionCount;
    private double totalMarks;

    public ExamSummaryDto() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public int getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(int questionCount) {
        this.questionCount = questionCount;
    }

    public double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(double totalMarks) {
        this.totalMarks = totalMarks;
    }
}
