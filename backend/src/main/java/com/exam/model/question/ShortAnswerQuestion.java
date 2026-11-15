package com.exam.model.question;

import com.exam.model.submission.StudentAnswer;
import com.exam.oop.strategy.GradingStrategy;

import java.util.ArrayList;
import java.util.List;

/**
 * Concrete Short Answer / Fill In The Blank Question.
 * 
 * Demonstrates:
 * - Inheritance: Subclass of Question.
 * - Polymorphism: Overrides evaluate() using keyword and phrase matching.
 * - Encapsulation: Model answer and accepted variations encapsulated within the entity.
 */
public class ShortAnswerQuestion extends Question {

    private String modelAnswer;
    private List<String> acceptedKeywords = new ArrayList<>();
    private boolean caseSensitive;

    public ShortAnswerQuestion() {
        super();
    }

    public ShortAnswerQuestion(String id, String text, double marks, double penaltyMarks,
                               String explanation, String difficulty, String topic,
                               String modelAnswer, List<String> acceptedKeywords, boolean caseSensitive) {
        super(id, text, marks, penaltyMarks, explanation, difficulty, topic);
        this.modelAnswer = modelAnswer;
        this.acceptedKeywords = acceptedKeywords != null ? acceptedKeywords : new ArrayList<>();
        this.caseSensitive = caseSensitive;
    }

    @Override
    public QuestionType getQuestionType() {
        return QuestionType.SHORT_ANSWER;
    }

    @Override
    public EvaluationResult evaluate(StudentAnswer studentAnswer, GradingStrategy strategy) {
        if (studentAnswer == null || !studentAnswer.isAttempted() || studentAnswer.getTextAnswer() == null) {
            return new EvaluationResult(false, 0.0, getMarks(), "Unattempted", getCorrectAnswerSummary());
        }

        String candidateText = studentAnswer.getTextAnswer().trim();
        if (candidateText.isEmpty()) {
            return new EvaluationResult(false, 0.0, getMarks(), "Empty answer provided", getCorrectAnswerSummary());
        }

        boolean exactMatch;
        if (caseSensitive) {
            exactMatch = candidateText.equals(modelAnswer.trim());
        } else {
            exactMatch = candidateText.equalsIgnoreCase(modelAnswer.trim());
        }

        if (exactMatch) {
            double awarded = strategy.calculateScore(getMarks(), getPenaltyMarks(), 1.0);
            return new EvaluationResult(true, awarded, getMarks(), "Exact match with model answer!", getCorrectAnswerSummary());
        }

        String compareText = caseSensitive ? candidateText : candidateText.toLowerCase();

        // Check if candidate text directly matches any of the accepted alternative keywords/synonyms
        for (String kw : acceptedKeywords) {
            String target = caseSensitive ? kw.trim() : kw.trim().toLowerCase();
            if (compareText.equals(target)) {
                double awarded = strategy.calculateScore(getMarks(), getPenaltyMarks(), 1.0);
                return new EvaluationResult(true, awarded, getMarks(), "Accepted alternative answer!", getCorrectAnswerSummary());
            }
        }

        // Keyword verification for partial or semantic matching
        int matchedKeywords = 0;
        for (String kw : acceptedKeywords) {
            String target = caseSensitive ? kw.trim() : kw.trim().toLowerCase();
            if (compareText.contains(target)) {
                matchedKeywords++;
            }
        }

        double fraction = 0.0;
        if (!acceptedKeywords.isEmpty()) {
            fraction = (double) matchedKeywords / acceptedKeywords.size();
        }

        boolean isCorrect = fraction >= 0.75;
        double awarded = strategy.calculateScore(getMarks(), getPenaltyMarks(), fraction);
        String feedback = isCorrect ? "Acceptable answer matching core technical concepts." :
                (fraction > 0 ? "Contains some relevant keywords but lacks complete precision." : "Does not match expected answer.");

        return new EvaluationResult(isCorrect, awarded, getMarks(), feedback, getCorrectAnswerSummary());
    }

    @Override
    public String getCorrectAnswerSummary() {
        return modelAnswer;
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
}
