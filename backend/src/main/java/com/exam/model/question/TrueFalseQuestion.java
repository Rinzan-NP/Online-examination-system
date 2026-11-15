package com.exam.model.question;

import com.exam.model.submission.StudentAnswer;
import com.exam.oop.strategy.GradingStrategy;

/**
 * Concrete True/False Question.
 * 
 * Demonstrates:
 * - Inheritance: Subclass of Question.
 * - Polymorphism: Overrides evaluate() for boolean verification.
 * - Encapsulation: Protects boolean answer and produces standardized evaluation results.
 */
public class TrueFalseQuestion extends Question {

    private boolean correctAnswer;

    public TrueFalseQuestion() {
        super();
    }

    public TrueFalseQuestion(String id, String text, double marks, double penaltyMarks,
                             String explanation, String difficulty, String topic, boolean correctAnswer) {
        super(id, text, marks, penaltyMarks, explanation, difficulty, topic);
        this.correctAnswer = correctAnswer;
    }

    @Override
    public QuestionType getQuestionType() {
        return QuestionType.TRUE_FALSE;
    }

    @Override
    public EvaluationResult evaluate(StudentAnswer studentAnswer, GradingStrategy strategy) {
        if (studentAnswer == null || !studentAnswer.isAttempted() || studentAnswer.getBooleanAnswer() == null) {
            return new EvaluationResult(false, 0.0, getMarks(), "Unattempted", getCorrectAnswerSummary());
        }

        boolean matched = (studentAnswer.getBooleanAnswer() == this.correctAnswer);
        double correctnessFraction = matched ? 1.0 : 0.0;
        double awarded = strategy.calculateScore(getMarks(), getPenaltyMarks(), correctnessFraction);
        String feedback = matched ? "Correct response!" : "Incorrect response.";

        return new EvaluationResult(matched, awarded, getMarks(), feedback, getCorrectAnswerSummary());
    }

    @Override
    public String getCorrectAnswerSummary() {
        return correctAnswer ? "True" : "False";
    }

    public boolean isCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(boolean correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}
