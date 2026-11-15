package com.exam.oop.factory;

import com.exam.model.question.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

/**
 * Factory Design Pattern: QuestionFactory.
 * 
 * Demonstrates:
 * - Creational Pattern: Encapsulates object creation complexity.
 * - Loose Coupling: Client classes depend on the Question abstraction, not concrete constructors.
 */
@Component
public class QuestionFactory {

    public MultipleChoiceQuestion createMultipleChoiceQuestion(String text, double marks, double penalty,
                                                               String explanation, String difficulty, String topic,
                                                               List<QuestionOption> options, boolean allowMultiple) {
        String id = "Q-" + UUID.randomUUID().toString().substring(0, 8);
        return new MultipleChoiceQuestion(id, text, marks, penalty, explanation, difficulty, topic, options, allowMultiple);
    }

    public TrueFalseQuestion createTrueFalseQuestion(String text, double marks, double penalty,
                                                     String explanation, String difficulty, String topic,
                                                     boolean correctAnswer) {
        String id = "Q-" + UUID.randomUUID().toString().substring(0, 8);
        return new TrueFalseQuestion(id, text, marks, penalty, explanation, difficulty, topic, correctAnswer);
    }

    public ShortAnswerQuestion createShortAnswerQuestion(String text, double marks, double penalty,
                                                         String explanation, String difficulty, String topic,
                                                         String modelAnswer, List<String> acceptedKeywords, boolean caseSensitive) {
        String id = "Q-" + UUID.randomUUID().toString().substring(0, 8);
        return new ShortAnswerQuestion(id, text, marks, penalty, explanation, difficulty, topic, modelAnswer, acceptedKeywords, caseSensitive);
    }

    public CodingQuestion createCodingQuestion(String text, double marks, double penalty,
                                               String explanation, String difficulty, String topic,
                                               String language, String starterCode, String expectedSolution,
                                               List<TestCase> testCases) {
        String id = "Q-" + UUID.randomUUID().toString().substring(0, 8);
        return new CodingQuestion(id, text, marks, penalty, explanation, difficulty, topic, language, starterCode, expectedSolution, testCases);
    }
}
