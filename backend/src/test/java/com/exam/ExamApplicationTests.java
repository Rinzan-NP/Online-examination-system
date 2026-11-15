package com.exam;

import com.exam.model.exam.Exam;
import com.exam.model.exam.ExamBuilder;
import com.exam.model.exam.ExamStatus;
import com.exam.model.question.*;
import com.exam.model.submission.StudentAnswer;
import com.exam.oop.factory.QuestionFactory;
import com.exam.oop.observer.ExamEvent;
import com.exam.oop.observer.ExamEventPublisher;
import com.exam.oop.observer.NotificationObserver;
import com.exam.oop.strategy.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ExamApplicationTests {

    @Test
    @DisplayName("Context Loads & Spring Boot starts cleanly")
    void contextLoads() {
    }

    @Test
    @DisplayName("Strategy Pattern: Test Strict, Negative Marking, and Partial Credit grading")
    void testGradingStrategies() {
        GradingStrategy strict = new StrictGradingStrategy();
        assertEquals(4.0, strict.calculateScore(4.0, 1.0, 1.0));
        assertEquals(0.0, strict.calculateScore(4.0, 1.0, 0.5));
        assertEquals(0.0, strict.calculateScore(4.0, 1.0, 0.0));

        GradingStrategy negative = new NegativeMarkingStrategy();
        assertEquals(4.0, negative.calculateScore(4.0, 1.0, 1.0));
        assertEquals(-1.0, negative.calculateScore(4.0, 1.0, 0.0));

        GradingStrategy partial = new PartialCreditStrategy();
        assertEquals(4.0, partial.calculateScore(4.0, 1.0, 1.0));
        assertEquals(2.0, partial.calculateScore(4.0, 1.0, 0.5));
        assertEquals(0.0, partial.calculateScore(4.0, 1.0, 0.0));
    }

    @Test
    @DisplayName("Factory Pattern: QuestionFactory creates correct polymorphic question types")
    void testQuestionFactory() {
        QuestionFactory factory = new QuestionFactory();

        Question mcq = factory.createMultipleChoiceQuestion(
                "Sample MCQ", 2.0, 0.5, "Explanation", "EASY", "Topic",
                Arrays.asList(new QuestionOption("opt1", "Option A", true)), false
        );
        assertEquals(QuestionType.MULTIPLE_CHOICE, mcq.getQuestionType());
        assertTrue(mcq instanceof MultipleChoiceQuestion);

        Question tf = factory.createTrueFalseQuestion("Sample TF", 1.0, 0.0, "Exp", "EASY", "Topic", true);
        assertEquals(QuestionType.TRUE_FALSE, tf.getQuestionType());
        assertTrue(tf instanceof TrueFalseQuestion);

        Question sa = factory.createShortAnswerQuestion("Sample SA", 2.0, 0.0, "Exp", "MED", "Topic", "Java", List.of("java"), false);
        assertEquals(QuestionType.SHORT_ANSWER, sa.getQuestionType());
        assertTrue(sa instanceof ShortAnswerQuestion);

        Question coding = factory.createCodingQuestion("Sample Coding", 5.0, 0.0, "Exp", "HARD", "Topic", "java", "starter", "solution", List.of());
        assertEquals(QuestionType.CODING, coding.getQuestionType());
        assertTrue(coding instanceof CodingQuestion);
    }

    @Test
    @DisplayName("Builder Pattern: ExamBuilder constructs valid Exam entity with invariants")
    void testExamBuilder() {
        Exam exam = new ExamBuilder()
                .withId("EXAM-TEST")
                .withTitle("Test Exam")
                .withSubject("OOPS")
                .withDuration(30)
                .withPassingPercentage(50.0)
                .withStatus(ExamStatus.ACTIVE)
                .withGradingStrategy(GradingStrategyType.STRICT)
                .build();

        assertNotNull(exam);
        assertEquals("EXAM-TEST", exam.getId());
        assertEquals("Test Exam", exam.getTitle());
        assertEquals(30, exam.getDurationMinutes());
        assertEquals(ExamStatus.ACTIVE, exam.getStatus());
    }

    @Test
    @DisplayName("Polymorphism: Question.evaluate() evaluates MCQ, TF, ShortAnswer correctly")
    void testPolymorphicEvaluation() {
        GradingStrategy strict = new StrictGradingStrategy();

        // 1. MCQ
        MultipleChoiceQuestion mcq = new MultipleChoiceQuestion(
                "Q-1", "Capital of France?", 2.0, 0.0, "Paris", "EASY", "Geo",
                Arrays.asList(new QuestionOption("1", "London", false), new QuestionOption("2", "Paris", true)),
                false
        );
        StudentAnswer saCorrect = new StudentAnswer("Q-1");
        saCorrect.setSelectedOptionIndices(List.of(1));
        EvaluationResult mcqRes = mcq.evaluate(saCorrect, strict);
        assertTrue(mcqRes.isCorrect());
        assertEquals(2.0, mcqRes.getScoreAwarded());

        // 2. True / False
        TrueFalseQuestion tf = new TrueFalseQuestion("Q-2", "Is earth round?", 1.0, 0.0, "Yes", "EASY", "Sci", true);
        StudentAnswer tfAnswer = new StudentAnswer("Q-2");
        tfAnswer.setBooleanAnswer(true);
        EvaluationResult tfRes = tf.evaluate(tfAnswer, strict);
        assertTrue(tfRes.isCorrect());
        assertEquals(1.0, tfRes.getScoreAwarded());

        // 3. Short Answer with synonym
        ShortAnswerQuestion sa = new ShortAnswerQuestion(
                "Q-3", "Primitive synchronization tool?", 2.0, 0.0, "Exp", "MED", "OS",
                "Semaphore", List.of("semaphore", "counting semaphore"), false
        );
        StudentAnswer saAns = new StudentAnswer("Q-3");
        saAns.setTextAnswer("Counting semaphore");
        EvaluationResult saRes = sa.evaluate(saAns, strict);
        assertTrue(saRes.isCorrect());
        assertEquals(2.0, saRes.getScoreAwarded());
    }

    @Test
    @DisplayName("Observer Pattern: ExamEventPublisher broadcasts to registered observers")
    void testObserverPattern() {
        ExamEventPublisher publisher = new ExamEventPublisher();
        NotificationObserver observer = new NotificationObserver();
        publisher.registerObserver(observer);

        publisher.publishEvent(new ExamEvent(ExamEvent.EventType.EXAM_STARTED, "EXAM-101", "Operating Systems", "STUDENT-001", "Alex Mercer", 0.0));
        List<String> notifications = observer.getRecentNotifications();
        assertFalse(notifications.isEmpty());
        assertTrue(notifications.get(0).contains("Alex Mercer"));
    }
}
