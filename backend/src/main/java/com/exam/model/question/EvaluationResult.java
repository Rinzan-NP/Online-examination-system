package com.exam.model.question;

/**
 * Encapsulated Evaluation Result produced by evaluating a student's answer.
 */
public class EvaluationResult {

    private boolean isCorrect;
    private double scoreAwarded;
    private double maxScore;
    private String feedback;
    private String correctSolution;

    public EvaluationResult() {}

    public EvaluationResult(boolean isCorrect, double scoreAwarded, double maxScore, String feedback, String correctSolution) {
        this.isCorrect = isCorrect;
        this.scoreAwarded = scoreAwarded;
        this.maxScore = maxScore;
        this.feedback = feedback;
        this.correctSolution = correctSolution;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    public double getScoreAwarded() {
        return scoreAwarded;
    }

    public void setScoreAwarded(double scoreAwarded) {
        this.scoreAwarded = scoreAwarded;
    }

    public double getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(double maxScore) {
        this.maxScore = maxScore;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getCorrectSolution() {
        return correctSolution;
    }

    public void setCorrectSolution(String correctSolution) {
        this.correctSolution = correctSolution;
    }
}
