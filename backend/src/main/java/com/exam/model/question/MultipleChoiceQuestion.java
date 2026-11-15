package com.exam.model.question;

import com.exam.model.submission.StudentAnswer;
import com.exam.oop.strategy.GradingStrategy;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Concrete Multiple Choice Question.
 * 
 * Demonstrates:
 * - Inheritance: Subclass of Question.
 * - Polymorphism: Overrides evaluate() with multi-option grading logic.
 * - Encapsulation: Protects options collection and correct answer validation.
 */
public class MultipleChoiceQuestion extends Question {

    private List<QuestionOption> options = new ArrayList<>();
    private boolean allowMultiple;

    public MultipleChoiceQuestion() {
        super();
    }

    public MultipleChoiceQuestion(String id, String text, double marks, double penaltyMarks,
                                  String explanation, String difficulty, String topic,
                                  List<QuestionOption> options, boolean allowMultiple) {
        super(id, text, marks, penaltyMarks, explanation, difficulty, topic);
        this.options = options != null ? options : new ArrayList<>();
        this.allowMultiple = allowMultiple;
    }

    @Override
    public QuestionType getQuestionType() {
        return QuestionType.MULTIPLE_CHOICE;
    }

    @Override
    public EvaluationResult evaluate(StudentAnswer studentAnswer, GradingStrategy strategy) {
        if (studentAnswer == null || !studentAnswer.isAttempted() || studentAnswer.getSelectedOptionIndices() == null) {
            return new EvaluationResult(false, 0.0, getMarks(), "Unattempted", getCorrectAnswerSummary());
        }

        Set<Integer> correctIndices = new HashSet<>();
        for (int i = 0; i < options.size(); i++) {
            if (options.get(i).isCorrect()) {
                correctIndices.add(i);
            }
        }

        // Safety fallback: if no option was marked correct, default to the first option (Option A)
        if (correctIndices.isEmpty() && !options.isEmpty()) {
            options.get(0).setCorrect(true);
            correctIndices.add(0);
        }

        Set<Integer> studentIndices = new HashSet<>(studentAnswer.getSelectedOptionIndices());

        double correctnessFraction;
        if (allowMultiple) {
            // Calculate Jaccard-like or precision/recall overlap for multi-select
            int correctlyChosen = 0;
            int wronglyChosen = 0;
            for (int idx : studentIndices) {
                if (correctIndices.contains(idx)) {
                    correctlyChosen++;
                } else {
                    wronglyChosen++;
                }
            }

            if (correctlyChosen == correctIndices.size() && wronglyChosen == 0) {
                correctnessFraction = 1.0;
            } else if (wronglyChosen > 0 && correctlyChosen == 0) {
                correctnessFraction = 0.0;
            } else {
                double match = Math.max(0.0, (double) (correctlyChosen - wronglyChosen) / (correctIndices.isEmpty() ? 1 : correctIndices.size()));
                correctnessFraction = match;
            }
        } else {
            // Single choice
            if (!correctIndices.isEmpty() && studentIndices.equals(correctIndices)) {
                correctnessFraction = 1.0;
            } else {
                correctnessFraction = 0.0;
            }
        }

        double awarded = strategy.calculateScore(getMarks(), getPenaltyMarks(), correctnessFraction);
        boolean isCorrect = correctnessFraction >= 0.999;
        String feedback = isCorrect ? "Correct answer!" : (correctnessFraction > 0 ? "Partially correct answer." : "Incorrect option selected.");

        return new EvaluationResult(isCorrect, awarded, getMarks(), feedback, getCorrectAnswerSummary());
    }

    @Override
    public String getCorrectAnswerSummary() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < options.size(); i++) {
            if (options.get(i).isCorrect()) {
                if (sb.length() > 0) sb.append(", ");
                char letter = (char) ('A' + i);
                sb.append(letter).append(": ").append(options.get(i).getText());
            }
        }
        if (sb.length() == 0 && !options.isEmpty()) {
            char letter = 'A';
            sb.append(letter).append(": ").append(options.get(0).getText());
        }
        return sb.toString();
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
}
