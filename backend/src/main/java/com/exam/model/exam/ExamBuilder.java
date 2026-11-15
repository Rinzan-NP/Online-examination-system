package com.exam.model.exam;

import com.exam.model.question.Question;
import com.exam.oop.strategy.GradingStrategyType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Creational Pattern: Builder Pattern for constructing complex Exam objects.
 * 
 * Demonstrates:
 * - Fluent interface for readable step-by-step entity construction.
 * - Invariant validation before building the final Exam instance.
 */
public class ExamBuilder {

    private String id;
    private String title;
    private String description;
    private String subject;
    private String instructorId;
    private String instructorName;
    private int durationMinutes = 30;
    private double passingPercentage = 50.0;
    private ExamStatus status = ExamStatus.ACTIVE;
    private GradingStrategyType gradingStrategyType = GradingStrategyType.STRICT;
    private List<Question> questions = new ArrayList<>();
    private String instructions;

    public ExamBuilder() {
        this.id = "EXAM-" + UUID.randomUUID().toString().substring(0, 8);
    }

    public ExamBuilder withId(String id) {
        this.id = id;
        return this;
    }

    public ExamBuilder withTitle(String title) {
        this.title = title;
        return this;
    }

    public ExamBuilder withDescription(String description) {
        this.description = description;
        return this;
    }

    public ExamBuilder withSubject(String subject) {
        this.subject = subject;
        return this;
    }

    public ExamBuilder withInstructor(String instructorId, String instructorName) {
        this.instructorId = instructorId;
        this.instructorName = instructorName;
        return this;
    }

    public ExamBuilder withDuration(int durationMinutes) {
        this.durationMinutes = durationMinutes;
        return this;
    }

    public ExamBuilder withPassingPercentage(double passingPercentage) {
        this.passingPercentage = passingPercentage;
        return this;
    }

    public ExamBuilder withStatus(ExamStatus status) {
        this.status = status;
        return this;
    }

    public ExamBuilder withGradingStrategy(GradingStrategyType type) {
        this.gradingStrategyType = type;
        return this;
    }

    public ExamBuilder addQuestion(Question question) {
        if (question != null) {
            this.questions.add(question);
        }
        return this;
    }

    public ExamBuilder withQuestions(List<Question> questions) {
        if (questions != null) {
            this.questions = new ArrayList<>(questions);
        }
        return this;
    }

    public ExamBuilder withInstructions(String instructions) {
        this.instructions = instructions;
        return this;
    }

    public Exam build() {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalStateException("Exam title cannot be empty");
        }
        if (durationMinutes <= 0) {
            throw new IllegalStateException("Exam duration must be positive");
        }
        return new Exam(id, title, description, subject, instructorId, instructorName,
                durationMinutes, passingPercentage, status, gradingStrategyType, questions, instructions);
    }
}
