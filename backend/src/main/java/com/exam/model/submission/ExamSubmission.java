package com.exam.model.submission;

import com.exam.model.BaseEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Encapsulated Exam Submission Entity.
 * 
 * Demonstrates:
 * - Encapsulation: Protects student's answers, score tally, and feedback breakdown.
 * - State Management: Transitions between IN_PROGRESS -> SUBMITTED -> EVALUATED.
 */
public class ExamSubmission extends BaseEntity {

    private String examId;
    private String examTitle;
    private String studentId;
    private String studentName;
    private String studentRollNo;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private long timeTakenSeconds;
    private List<StudentAnswer> answers = new ArrayList<>();
    private List<QuestionFeedback> feedbacks = new ArrayList<>();
    private double totalScoreAwarded;
    private double totalPossibleScore;
    private double percentage;
    private boolean passed;
    private SubmissionStatus status;

    public ExamSubmission() {
        super();
        this.status = SubmissionStatus.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
    }

    public ExamSubmission(String id, String examId, String examTitle, String studentId, String studentName, String studentRollNo) {
        super(id);
        this.examId = examId;
        this.examTitle = examTitle;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentRollNo = studentRollNo;
        this.startedAt = LocalDateTime.now();
        this.status = SubmissionStatus.IN_PROGRESS;
    }

    public void completeEvaluation(double awarded, double possible, boolean passedStatus, List<QuestionFeedback> feedbackList) {
        this.submittedAt = LocalDateTime.now();
        this.status = SubmissionStatus.EVALUATED;
        this.totalScoreAwarded = Math.round(awarded * 100.0) / 100.0;
        this.totalPossibleScore = possible;
        this.passed = passedStatus;
        this.percentage = possible > 0 ? Math.round(((awarded / possible) * 100.0) * 10.0) / 10.0 : 0.0;
        this.feedbacks = feedbackList != null ? feedbackList : new ArrayList<>();
    }

    // Getters and Setters
    public String getExamId() {
        return examId;
    }

    public void setExamId(String examId) {
        this.examId = examId;
    }

    public String getExamTitle() {
        return examTitle;
    }

    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentRollNo() {
        return studentRollNo;
    }

    public void setStudentRollNo(String studentRollNo) {
        this.studentRollNo = studentRollNo;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public long getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(long timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }

    public List<StudentAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<StudentAnswer> answers) {
        this.answers = answers;
    }

    public List<QuestionFeedback> getFeedbacks() {
        return feedbacks;
    }

    public void setFeedbacks(List<QuestionFeedback> feedbacks) {
        this.feedbacks = feedbacks;
    }

    public double getTotalScoreAwarded() {
        return totalScoreAwarded;
    }

    public void setTotalScoreAwarded(double totalScoreAwarded) {
        this.totalScoreAwarded = totalScoreAwarded;
    }

    public double getTotalPossibleScore() {
        return totalPossibleScore;
    }

    public void setTotalPossibleScore(double totalPossibleScore) {
        this.totalPossibleScore = totalPossibleScore;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public SubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }
}
