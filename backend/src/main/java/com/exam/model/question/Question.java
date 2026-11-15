package com.exam.model.question;

import com.exam.model.BaseEntity;
import com.exam.model.submission.StudentAnswer;
import com.exam.oop.strategy.GradingStrategy;

/**
 * Abstract Base Question.
 * 
 * Demonstrates:
 * - Abstraction: Outlines the contract for all question types.
 * - Inheritance: Subclasses MultipleChoiceQuestion, TrueFalseQuestion, ShortAnswerQuestion, and CodingQuestion.
 * - Polymorphism: Each subclass defines its own evaluate() algorithm via dynamic method dispatch.
 * - Encapsulation: State is protected with getters/setters and domain validations.
 */
public abstract class Question extends BaseEntity {

    private String text;
    private double marks;
    private double penaltyMarks;
    private String explanation;
    private String difficulty; // EASY, MEDIUM, HARD
    private String topic;

    public Question() {
        super();
        this.marks = 1.0;
        this.penaltyMarks = 0.25;
        this.difficulty = "MEDIUM";
    }

    public Question(String id, String text, double marks, double penaltyMarks, String explanation, String difficulty, String topic) {
        super(id);
        this.text = text;
        this.marks = marks > 0 ? marks : 1.0;
        this.penaltyMarks = penaltyMarks >= 0 ? penaltyMarks : 0.0;
        this.explanation = explanation;
        this.difficulty = difficulty != null ? difficulty : "MEDIUM";
        this.topic = topic;
    }

    /**
     * Polymorphic evaluation method.
     * Overridden by each Question subclass to grade student responses dynamically.
     */
    public abstract EvaluationResult evaluate(StudentAnswer studentAnswer, GradingStrategy strategy);

    /**
     * Identifies the Question Type.
     */
    public abstract QuestionType getQuestionType();

    /**
     * Returns a human-friendly string of the correct answer for post-exam review.
     */
    public abstract String getCorrectAnswerSummary();

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public double getMarks() {
        return marks;
    }

    public void setMarks(double marks) {
        this.marks = marks > 0 ? marks : 1.0;
    }

    public double getPenaltyMarks() {
        return penaltyMarks;
    }

    public void setPenaltyMarks(double penaltyMarks) {
        this.penaltyMarks = penaltyMarks >= 0 ? penaltyMarks : 0.0;
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
}
