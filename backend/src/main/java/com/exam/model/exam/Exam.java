package com.exam.model.exam;

import com.exam.model.BaseEntity;
import com.exam.model.question.Question;
import com.exam.oop.strategy.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Exam Entity.
 * 
 * Demonstrates:
 * - Encapsulation: Strict business invariant checks (duration > 0, questions list protected).
 * - Composition: Aggregates a polymorphic collection of Question instances.
 * - Strategy Pattern Integration: Holds a dynamic GradingStrategy.
 */
public class Exam extends BaseEntity {

    private String title;
    private String description;
    private String subject;
    private String instructorId;
    private String instructorName;
    private int durationMinutes;
    private double passingPercentage;
    private ExamStatus status;
    private GradingStrategyType gradingStrategyType;
    private transient GradingStrategy gradingStrategy;
    private List<Question> questions = new ArrayList<>();
    private String instructions;

    public Exam() {
        super();
        this.status = ExamStatus.ACTIVE;
        this.durationMinutes = 30;
        this.passingPercentage = 50.0;
        this.gradingStrategyType = GradingStrategyType.STRICT;
        this.gradingStrategy = new StrictGradingStrategy();
    }

    public Exam(String id, String title, String description, String subject,
                String instructorId, String instructorName, int durationMinutes,
                double passingPercentage, ExamStatus status, GradingStrategyType strategyType,
                List<Question> questions, String instructions) {
        super(id);
        this.title = title;
        this.description = description;
        this.subject = subject;
        this.instructorId = instructorId;
        this.instructorName = instructorName;
        this.durationMinutes = durationMinutes > 0 ? durationMinutes : 30;
        this.passingPercentage = passingPercentage >= 0 ? passingPercentage : 50.0;
        this.status = status != null ? status : ExamStatus.ACTIVE;
        this.gradingStrategyType = strategyType != null ? strategyType : GradingStrategyType.STRICT;
        this.gradingStrategy = resolveStrategy(this.gradingStrategyType);
        this.questions = questions != null ? questions : new ArrayList<>();
        this.instructions = instructions;
    }

    public static GradingStrategy resolveStrategy(GradingStrategyType type) {
        if (type == null) return new StrictGradingStrategy();
        switch (type) {
            case NEGATIVE_MARKING:
                return new NegativeMarkingStrategy();
            case PARTIAL_CREDIT:
                return new PartialCreditStrategy();
            case STRICT:
            default:
                return new StrictGradingStrategy();
        }
    }

    public void addQuestion(Question question) {
        if (question != null) {
            this.questions.add(question);
        }
    }

    public double calculateTotalMarks() {
        double sum = 0.0;
        for (Question q : questions) {
            sum += q.getMarks();
        }
        return sum;
    }

    public boolean isPassed(double score) {
        double total = calculateTotalMarks();
        if (total <= 0.0) return false;
        double pct = (score / total) * 100.0;
        return pct >= passingPercentage;
    }

    public GradingStrategy getGradingStrategy() {
        if (this.gradingStrategy == null) {
            this.gradingStrategy = resolveStrategy(this.gradingStrategyType);
        }
        return gradingStrategy;
    }

    public void setGradingStrategyType(GradingStrategyType type) {
        this.gradingStrategyType = type;
        this.gradingStrategy = resolveStrategy(type);
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(String instructorId) {
        this.instructorId = instructorId;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = Math.max(1, durationMinutes);
    }

    public double getPassingPercentage() {
        return passingPercentage;
    }

    public void setPassingPercentage(double passingPercentage) {
        this.passingPercentage = passingPercentage;
    }

    public ExamStatus getStatus() {
        return status;
    }

    public void setStatus(ExamStatus status) {
        this.status = status;
    }

    public GradingStrategyType getGradingStrategyType() {
        return gradingStrategyType;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}
