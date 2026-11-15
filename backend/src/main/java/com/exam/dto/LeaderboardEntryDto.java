package com.exam.dto;

public class LeaderboardEntryDto {

    private int rank;
    private String studentId;
    private String studentName;
    private String studentRollNo;
    private double score;
    private double totalPossibleScore;
    private double percentage;
    private long timeTakenSeconds;
    private boolean passed;

    public LeaderboardEntryDto() {}

    public LeaderboardEntryDto(int rank, String studentId, String studentName, String studentRollNo,
                               double score, double totalPossibleScore, double percentage,
                               long timeTakenSeconds, boolean passed) {
        this.rank = rank;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentRollNo = studentRollNo;
        this.score = score;
        this.totalPossibleScore = totalPossibleScore;
        this.percentage = percentage;
        this.timeTakenSeconds = timeTakenSeconds;
        this.passed = passed;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
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

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
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

    public long getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(long timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }
}
