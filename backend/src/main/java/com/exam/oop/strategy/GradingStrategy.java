package com.exam.oop.strategy;

/**
 * Strategy Design Pattern: Strategy Interface for Exam Grading.
 * 
 * Demonstrates:
 * - Open/Closed Principle: New grading rules can be introduced without altering existing code.
 * - Polymorphism: Different concrete strategies execute different scoring calculations at runtime.
 */
public interface GradingStrategy {

    /**
     * Calculates score awarded based on maximum score, penalty, and fraction of correctness.
     * 
     * @param maxScore maximum marks allocated for the question
     * @param penalty penalty marks configured for incorrect answers
     * @param correctnessFraction 1.0 for completely correct, 0.0 for completely incorrect, or intermediate for partial credit
     * @return calculated score (can be negative if penalty marking applies)
     */
    double calculateScore(double maxScore, double penalty, double correctnessFraction);

    /**
     * Human-readable description of this grading algorithm.
     */
    String getDescription();

    /**
     * Returns the strategy type enum identifier.
     */
    GradingStrategyType getType();
}
