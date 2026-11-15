package com.exam.oop.strategy;

/**
 * Concrete Strategy: Strict (All or Nothing) Grading.
 * Full marks if 100% correct, otherwise 0 marks.
 */
public class StrictGradingStrategy implements GradingStrategy {

    @Override
    public double calculateScore(double maxScore, double penalty, double correctnessFraction) {
        if (correctnessFraction >= 0.999) {
            return maxScore;
        }
        return 0.0;
    }

    @Override
    public String getDescription() {
        return "Strict Grading: Full marks for completely correct answers, 0 marks otherwise.";
    }

    @Override
    public GradingStrategyType getType() {
        return GradingStrategyType.STRICT;
    }
}
