package com.exam.oop.strategy;

/**
 * Concrete Strategy: Partial Credit Grading.
 * Pro-rates marks proportionally according to correctness.
 */
public class PartialCreditStrategy implements GradingStrategy {

    @Override
    public double calculateScore(double maxScore, double penalty, double correctnessFraction) {
        if (correctnessFraction <= 0.0) {
            return 0.0;
        }
        return Math.round((maxScore * correctnessFraction) * 100.0) / 100.0;
    }

    @Override
    public String getDescription() {
        return "Partial Credit: Marks are awarded proportionally based on completeness and accuracy.";
    }

    @Override
    public GradingStrategyType getType() {
        return GradingStrategyType.PARTIAL_CREDIT;
    }
}
