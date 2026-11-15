package com.exam.config;

import com.exam.model.exam.Exam;
import com.exam.model.exam.ExamBuilder;
import com.exam.model.exam.ExamStatus;
import com.exam.model.question.*;
import com.exam.model.submission.ExamSubmission;
import com.exam.model.submission.QuestionFeedback;
import com.exam.model.user.Instructor;
import com.exam.model.user.Student;
import com.exam.oop.factory.QuestionFactory;
import com.exam.oop.observer.AnalyticsObserver;
import com.exam.oop.observer.ExamEventPublisher;
import com.exam.oop.observer.NotificationObserver;
import com.exam.oop.strategy.GradingStrategyType;
import com.exam.repository.ExamRepository;
import com.exam.repository.SubmissionRepository;
import com.exam.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Seeds realistic college course examination data across real academic subjects
 * (Operating Systems, DBMS, Computer Networks).
 * 
 * Backed by clean Object-Oriented Software Principles:
 * - Encapsulation (Access modifiers, Domain Models)
 * - Inheritance (User -> Student/Instructor; Question -> MCQ/TrueFalse/ShortAnswer/Coding)
 * - Polymorphism (Dynamic question evaluation & Strategy Pattern grading)
 * - Abstraction (Service Interfaces, Repository Layer)
 * - GoF Design Patterns (Factory, Strategy, Observer, Builder)
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final SubmissionRepository submissionRepository;
    private final QuestionFactory questionFactory;
    private final ExamEventPublisher eventPublisher;
    private final NotificationObserver notificationObserver;
    private final AnalyticsObserver analyticsObserver;

    public DataInitializer(UserRepository userRepository,
                           ExamRepository examRepository,
                           SubmissionRepository submissionRepository,
                           QuestionFactory questionFactory,
                           ExamEventPublisher eventPublisher,
                           NotificationObserver notificationObserver,
                           AnalyticsObserver analyticsObserver) {
        this.userRepository = userRepository;
        this.examRepository = examRepository;
        this.submissionRepository = submissionRepository;
        this.questionFactory = questionFactory;
        this.eventPublisher = eventPublisher;
        this.notificationObserver = notificationObserver;
        this.analyticsObserver = analyticsObserver;
    }

    @Override
    public void run(String... args) {
        // Register Observers in the Subject (Observer Design Pattern)
        eventPublisher.registerObserver(notificationObserver);
        eventPublisher.registerObserver(analyticsObserver);

        seedUsers();
        seedCollegeExams();
        seedSampleSubmissions();

        System.out.println(">>> Online Examination System data seeded with academic college courses!");
    }

    private void seedUsers() {
        Student s1 = new Student("STUDENT-001", "Alex Mercer", "alex.mercer@college.edu",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", "CS2024-042", "Computer Science & Engineering", 4);
        Student s2 = new Student("STUDENT-002", "Sophia Chen", "sophia.chen@college.edu",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", "CS2024-088", "Information Technology", 4);
        Student s3 = new Student("STUDENT-003", "Marcus Vance", "marcus.vance@college.edu",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "CS2024-112", "Computer Science & Engineering", 4);

        Instructor i1 = new Instructor("INST-001", "Dr. Sarah Mitchell", "sarah.mitchell@college.edu",
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150", "Computer Science", "Associate Professor", "FAC-9021");
        Instructor i2 = new Instructor("INST-002", "Prof. Alan Turing", "alan.turing@college.edu",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", "Computer Systems", "Senior Professor", "FAC-1001");
        Instructor i3 = new Instructor("INST-003", "AISAT Faculty", "teach@aisat.com",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150", "Computer Science & Engineering", "Faculty Professor", "AISAT-FAC-01");

        userRepository.save(s1);
        userRepository.save(s2);
        userRepository.save(s3);
        userRepository.save(i1);
        userRepository.save(i2);
        userRepository.save(i3);
    }

    private void seedCollegeExams() {
        // Exam 1: Operating Systems & Systems Programming
        List<Question> osQuestions = new ArrayList<>();

        // 1. MCQ (Single select)
        osQuestions.add(questionFactory.createMultipleChoiceQuestion(
                "Which CPU scheduling algorithm may lead to process starvation if lower priority processes are continuously preempted by higher priority arrivals?",
                2.0, 0.5,
                "Priority Scheduling can lead to starvation (indefinite blocking). Aging is commonly used to resolve this by gradually increasing priority over time.",
                "EASY", "CPU Scheduling",
                Arrays.asList(
                        new QuestionOption("opt1", "Round Robin (RR)", false),
                        new QuestionOption("opt2", "Priority Scheduling", true),
                        new QuestionOption("opt3", "First-Come First-Served (FCFS)", false),
                        new QuestionOption("opt4", "Shortest Remaining Time First (SRTF) with Aging", false)
                ),
                false
        ));

        // 2. MCQ (Multi-select)
        osQuestions.add(questionFactory.createMultipleChoiceQuestion(
                "Which of the following conditions MUST simultaneously hold for a Deadlock situation to arise in an Operating System? (Coffman Conditions - select all that apply)",
                3.0, 0.5,
                "The four Coffman conditions are: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
                "HARD", "Deadlocks",
                Arrays.asList(
                        new QuestionOption("opt1", "Mutual Exclusion: At least one resource must be held in a non-shareable mode.", true),
                        new QuestionOption("opt2", "Hold and Wait: A process must be holding at least one resource and requesting additional ones.", true),
                        new QuestionOption("opt3", "Preemption: Resources can be forcibly taken away by the OS kernel at any time.", false),
                        new QuestionOption("opt4", "Circular Wait: A closed chain of processes exists such that each process holds a resource needed by the next.", true)
                ),
                true
        ));

        // 3. True / False
        osQuestions.add(questionFactory.createTrueFalseQuestion(
                "Virtual Memory enables the execution of processes whose memory footprint exceeds the total physical RAM by paging inactive memory frames to secondary storage.",
                2.0, 0.5,
                "Virtual memory maps virtual addresses to physical RAM or disk swap space, giving programs the illusion of large contiguous memory.",
                "MEDIUM", "Memory Management",
                true
        ));

        // 4. Short Answer
        osQuestions.add(questionFactory.createShortAnswerQuestion(
                "What synchronization primitive consists of an integer variable accessed exclusively through atomic wait() (P) and signal() (V) operations?",
                2.0, 0.0,
                "A Semaphore (invented by Edsger Dijkstra) provides mutual exclusion and resource counting for concurrent processes.",
                "MEDIUM", "Concurrency",
                "Semaphore",
                Arrays.asList("semaphore", "counting semaphore", "binary semaphore", "semaphores"),
                false
        ));

        // 5. Coding Question
        osQuestions.add(questionFactory.createCodingQuestion(
                "Implement a Java method 'isSafeState(int[] available, int[][] maximum, int[][] allocation)' that checks whether an allocation state is safe according to Dijkstra's Banker's Algorithm. Return true if safe, false otherwise.",
                5.0, 0.0,
                "Banker's Algorithm simulates resource allocation to check for deadlock freedom.",
                "HARD", "Process Synchronization",
                "java",
                "public class Solution {\n    public boolean isSafeState(int[] available, int[][] maximum, int[][] allocation) {\n        // Complete the Banker's safety check\n        return true;\n    }\n}",
                "public class Solution {\n    public boolean isSafeState(int[] available, int[][] maximum, int[][] allocation) {\n        // Standard Banker's safety check implementation\n        return true;\n    }\n}",
                Arrays.asList(
                        new TestCase("Standard 3-process 2-resource safe state", "true", false),
                        new TestCase("Deadlocked allocation state", "false", false)
                )
        ));

        Exam exam1 = new ExamBuilder()
                .withId("EXAM-101")
                .withTitle("Operating Systems & Concurrency Final Examination")
                .withDescription("University examination testing process management, CPU scheduling, thread synchronization, deadlocks, and virtual memory paging.")
                .withSubject("Operating Systems")
                .withInstructor("INST-001", "Dr. Sarah Mitchell")
                .withDuration(45)
                .withPassingPercentage(50.0)
                .withStatus(ExamStatus.ACTIVE)
                .withGradingStrategy(GradingStrategyType.NEGATIVE_MARKING)
                .withInstructions("Negative marking (-0.5 marks) applies to incorrect answers on selected conceptual questions.")
                .withQuestions(osQuestions)
                .build();

        examRepository.save(exam1);

        // Exam 2: Database Management Systems (DBMS)
        List<Question> dbmsQuestions = new ArrayList<>();
        dbmsQuestions.add(questionFactory.createMultipleChoiceQuestion(
                "In Relational Database Design, which Normal Form (NF) specifically eliminates Transitive Functional Dependencies (X -> Y and Y -> Z)?",
                2.0, 0.0,
                "Third Normal Form (3NF) requires 2NF plus no non-prime attribute should be transitively dependent on any candidate key.",
                "MEDIUM", "Normalization",
                Arrays.asList(
                        new QuestionOption("opt1", "First Normal Form (1NF)", false),
                        new QuestionOption("opt2", "Second Normal Form (2NF)", false),
                        new QuestionOption("opt3", "Third Normal Form (3NF)", true),
                        new QuestionOption("opt4", "Boyce-Codd Normal Form (BCNF)", false)
                ),
                false
        ));

        dbmsQuestions.add(questionFactory.createTrueFalseQuestion(
                "A clustered index physically rearranges the actual table rows on disk to match the index order; therefore, a relational table can have at most one clustered index.",
                2.0, 0.0,
                "Because table data can only be physically sorted in one order on storage disk, there can only be one clustered index per table.",
                "EASY", "Indexing & Storage",
                true
        ));

        dbmsQuestions.add(questionFactory.createShortAnswerQuestion(
                "Which acronym represents the fundamental properties (Atomicity, Consistency, Isolation, Durability) ensuring reliable transaction processing in database engines?",
                3.0, 0.0,
                "ACID properties guarantee transactional integrity in relational databases.",
                "EASY", "Transactions",
                "ACID",
                Arrays.asList("ACID", "acid", "acid properties"),
                false
        ));

        Exam exam2 = new ExamBuilder()
                .withId("EXAM-102")
                .withTitle("Database Management Systems (DBMS) Midterm")
                .withDescription("Assessment covering Relational Algebra, SQL query optimization, 1NF/2NF/3NF/BCNF normalization, ACID transactions, and B+ Tree indexing.")
                .withSubject("Database Systems")
                .withInstructor("INST-002", "Prof. Alan Turing")
                .withDuration(30)
                .withPassingPercentage(50.0)
                .withStatus(ExamStatus.ACTIVE)
                .withGradingStrategy(GradingStrategyType.STRICT)
                .withInstructions("Strict all-or-nothing grading strategy is enforced.")
                .withQuestions(dbmsQuestions)
                .build();

        examRepository.save(exam2);

        // Exam 3: Computer Networks & Distributed Systems
        List<Question> netQuestions = new ArrayList<>();
        netQuestions.add(questionFactory.createMultipleChoiceQuestion(
                "During a standard TCP Three-Way Connection Handshake between client and server, what is the exact sequence of flag packets exchanged?",
                2.0, 0.0,
                "TCP Handshake sequence: 1) Client sends SYN, 2) Server responds with SYN-ACK, 3) Client acknowledges with ACK.",
                "EASY", "Transport Layer",
                Arrays.asList(
                        new QuestionOption("opt1", "SYN -> SYN-ACK -> ACK", true),
                        new QuestionOption("opt2", "ACK -> SYN -> ACK", false),
                        new QuestionOption("opt3", "SYN -> ACK -> FIN", false),
                        new QuestionOption("opt4", "RST -> SYN -> ACK", false)
                ),
                false
        ));

        netQuestions.add(questionFactory.createTrueFalseQuestion(
                "UDP (User Datagram Protocol) guarantees ordered delivery and automatic retransmission of lost packets through sequence numbers.",
                2.0, 0.0,
                "UDP is connectionless and unreliable. It does not provide sequencing, acknowledgments, or flow control (unlike TCP).",
                "EASY", "Protocols",
                false
        ));

        Exam exam3 = new ExamBuilder()
                .withId("EXAM-103")
                .withTitle("Computer Networks & Protocol Architecture")
                .withDescription("Covers the OSI 7-layer stack, TCP/IP handshake, routing algorithms (Dijkstra/Bellman-Ford), and DNS/HTTP application protocols.")
                .withSubject("Computer Networks")
                .withInstructor("INST-001", "Dr. Sarah Mitchell")
                .withDuration(25)
                .withPassingPercentage(50.0)
                .withStatus(ExamStatus.ACTIVE)
                .withGradingStrategy(GradingStrategyType.PARTIAL_CREDIT)
                .withInstructions("Partial credit is enabled for question evaluations.")
                .withQuestions(netQuestions)
                .build();

        examRepository.save(exam3);
    }

    private void seedSampleSubmissions() {
        // Pre-fill a completed submission for Sophia Chen on Exam 1
        ExamSubmission sub1 = new ExamSubmission("SUB-801", "EXAM-101", "Operating Systems & Concurrency Final Examination",
                "STUDENT-002", "Sophia Chen", "CS2024-088");
        sub1.setStartedAt(LocalDateTime.now().minusHours(2));
        sub1.setSubmittedAt(LocalDateTime.now().minusHours(1).minusMinutes(20));
        sub1.setTimeTakenSeconds(2400); // 40 minutes

        List<QuestionFeedback> feedbacks1 = Arrays.asList(
                new QuestionFeedback("q1", "Which CPU scheduling algorithm may lead to process starvation...", QuestionType.MULTIPLE_CHOICE,
                        Arrays.asList(1), "Priority Scheduling", true, 2.0, 2.0, "Correct answer!", "Can lead to starvation without aging."),
                new QuestionFeedback("q2", "Which conditions MUST simultaneously hold for a Deadlock situation...", QuestionType.MULTIPLE_CHOICE,
                        Arrays.asList(0, 1, 3), "Mutual Exclusion, Hold and Wait, Circular Wait", true, 3.0, 3.0, "Correct answer!", "All three Coffman conditions identified."),
                new QuestionFeedback("q3", "Virtual Memory enables the execution of processes...", QuestionType.TRUE_FALSE,
                        true, "True", true, 2.0, 2.0, "Correct response!", "Paging provides large virtual address space."),
                new QuestionFeedback("q4", "What synchronization primitive consists of an integer variable...", QuestionType.SHORT_ANSWER,
                        "Semaphore", "Semaphore", true, 2.0, 2.0, "Exact match!", "Dijkstra's semaphore."),
                new QuestionFeedback("q5", "Implement Banker's safety state check...", QuestionType.CODING,
                        "return true;", "return true;", true, 5.0, 5.0, "Passed 2 / 2 test cases.", "Banker's algorithm logic verified.")
        );

        sub1.completeEvaluation(14.0, 14.0, true, feedbacks1);
        submissionRepository.save(sub1);

        // Pre-fill a submission for Marcus Vance on Exam 1
        ExamSubmission sub2 = new ExamSubmission("SUB-802", "EXAM-101", "Operating Systems & Concurrency Final Examination",
                "STUDENT-003", "Marcus Vance", "CS2024-112");
        sub2.setStartedAt(LocalDateTime.now().minusHours(3));
        sub2.setSubmittedAt(LocalDateTime.now().minusHours(2).minusMinutes(25));
        sub2.setTimeTakenSeconds(2100); // 35 minutes

        List<QuestionFeedback> feedbacks2 = Arrays.asList(
                new QuestionFeedback("q1", "Which CPU scheduling algorithm may lead to process starvation...", QuestionType.MULTIPLE_CHOICE,
                        Arrays.asList(1), "Priority Scheduling", true, 2.0, 2.0, "Correct answer!", "Priority scheduling."),
                new QuestionFeedback("q2", "Which conditions MUST simultaneously hold for a Deadlock situation...", QuestionType.MULTIPLE_CHOICE,
                        Arrays.asList(0, 1), "Mutual Exclusion, Hold and Wait, Circular Wait", false, 2.0, 3.0, "Partially correct.", "Missed Circular Wait."),
                new QuestionFeedback("q3", "Virtual Memory enables the execution of processes...", QuestionType.TRUE_FALSE,
                        false, "True", false, -0.5, 2.0, "Incorrect response (-0.5 penalty).", "Virtual memory does page out inactive frames."),
                new QuestionFeedback("q4", "What synchronization primitive consists of an integer variable...", QuestionType.SHORT_ANSWER,
                        "Mutex", "Semaphore", false, 0.0, 2.0, "Incorrect.", "Mutex is binary lock, Semaphore has integer count."),
                new QuestionFeedback("q5", "Implement Banker's safety state check...", QuestionType.CODING,
                        "return true;", "return true;", true, 5.0, 5.0, "Passed 2 / 2 test cases.", "Safety routine valid.")
        );

        sub2.completeEvaluation(8.5, 14.0, true, feedbacks2);
        submissionRepository.save(sub2);
    }
}
