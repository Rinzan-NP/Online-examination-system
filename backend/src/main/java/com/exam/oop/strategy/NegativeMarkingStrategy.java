package com.exam.oop.strategy;

/**
 * Concrete Strategy: Negative Marking Grading.
 * Full marks if correct; deducts penalty if wrong; 0 if unattempted.
 */
public class NegativeMarkingStrategy implements GradingStrategy {

    @Override
    public double calculateScore(double maxScore, double penalty, double correctnessFraction) {
        if (correctnessFraction >= 0.999) {
            return maxScore;
        } else if (correctnessFraction < 0.001) {
            // Negative marking deduction
            return -Math.abs(penalty > 0 ? penalty : (maxScore * 0.25));
        } else {
            // Partial credit penalized slightly
            return (maxScore * correctnessFraction) - (penalty * 0.5);
        }
    }

    @Override
    public String getDescription() {
        return "Negative Marking: Full marks for correct answers, deduction of configured penalty for incorrect answers.";
    }

    @Override
    public GradingStrategyType getType() {
        return GradingStrategyType.NEGATIVE_MARKING;
    }
}
