package com.exam.oop.observer;

import java.time.LocalDateTime;

/**
 * Event object dispatched by ExamEventPublisher in the Observer Pattern.
 */
public class ExamEvent {

    public enum EventType {
        EXAM_CREATED,
        EXAM_STARTED,
        EXAM_SUBMITTED,
        EXAM_GRADED
    }

    private EventType eventType;
    private String examId;
    private String examTitle;
    private String studentId;
    private String studentName;
    private double score;
    private LocalDateTime timestamp;

    public ExamEvent(EventType eventType, String examId, String examTitle, String studentId, String studentName, double score) {
        this.eventType = eventType;
        this.examId = examId;
        this.examTitle = examTitle;
        this.studentId = studentId;
        this.studentName = studentName;
        this.score = score;
        this.timestamp = LocalDateTime.now();
    }

    public EventType getEventType() {
        return eventType;
    }

    public String getExamId() {
        return examId;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public double getScore() {
        return score;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
