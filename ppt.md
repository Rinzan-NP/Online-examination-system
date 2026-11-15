# ONLINE EXAMINATION SYSTEM
## Presentation Deck for B. Tech Semester V Project Evaluation
### Course: PECMT535 Object Oriented Programming Concepts
**Department of Artificial Intelligence and Machine Learning**  
**Albertian Institute of Science and Technology - AISAT (Autonomous), Kalamassery**  
**Affiliated to APJ Abdul Kalam Technological University (KTU)**

---

## Slide 1: Title Slide

### ONLINE EXAMINATION SYSTEM
**Course Project Presentation for PECMT535: Object Oriented Programming Concepts**

- **Program:** B. Tech in Computer Science and Engineering (Artificial Intelligence and Machine Learning)
- **Batch:** 2024 - 2028 (Semester V)
- **Institution:** Albertian Institute of Science and Technology - AISAT (Autonomous), Kalamassery, Kochi
- **Affiliating University:** APJ Abdul Kalam Technological University (KTU)

**Project Team Members:**
- Rinzan N.P (Roll No: AIK24AM050)
- Dinah Mohammed (Roll No: AIK24AM025)

**Faculty Guide:**
- Ms. Ashwathy Anda Chacko, Assistant Professor, Department of AI & ML

**Speaker Notes:**
- Good morning respected members of the evaluation committee and our faculty guide.
- Today, we present our course project for PECMT535 Object Oriented Programming Concepts: the "Online Examination System".
- Our project bridges pure object-oriented architectural principles with an enterprise-grade full-stack implementation using Java Spring Boot and React.

---

## Slide 2: Presentation Outline

### Agenda & Structure of Presentation

1. Introduction & Background
2. Problem Statement & Motivation
3. Project Objectives
4. Alignment with Course Outcomes (COs) and SDGs
5. System Architecture & Technology Stack
6. Core OOP Principles Implemented (Encapsulation, Inheritance, Polymorphism, Abstraction)
7. Gang-of-Four (GoF) Design Patterns (Strategy, Factory, Observer, Builder)
8. Functional Modules & User Workflows (Student & Faculty)
9. Application Walkthrough & User Interface Showcase
10. Testing, Verification & Results
11. Limitations & Future Scope
12. Conclusion & Summary

**Speaker Notes:**
- This presentation covers the theoretical motivation, software architecture, concrete OOP implementations, live application flows, and evaluation results.

---

## Slide 3: Introduction & Background

### Context and Need for Modern Assessment Systems

- **Academic Context:** Examination administration is fundamental to continuous assessment in higher education, requiring precise question delivery, timing, grading, and reporting.
- **Traditional Limitations:** Manual handling introduces evaluation latency, grading disparities, physical paper overhead, and scattered record-keeping.
- **Our Solution:** A modular, full-stack digital examination platform engineered with strict adherence to Object-Oriented Programming (OOP) paradigms.
- **Pedagogical Significance:** Developed to demonstrate that OOP concepts (like polymorphism and inheritance) and design patterns directly solve concrete enterprise challenges such as multi-format evaluation and dynamic scoring strategies.

**Key Highlights:**
- Enterprise-grade Java 17 Spring Boot backend.
- Apple Human Interface Guidelines (HIG)-inspired React 18 frontend.
- Zero extraneous visual elements; clean, distraction-free assessment environment.

**Speaker Notes:**
- Rather than building a generic quiz app, we designed an extensible assessment engine where grading rules, question types, and event monitors are decoupled through object-oriented abstractions.

---

## Slide 4: Problem Statement

### Operational Challenges in Traditional & Naive Assessment Tools

1. **Scattered Assessment Records:**
   - Exam schedules, question papers, candidate submissions, and scorecards exist in disconnected silos.
2. **Evaluation Latency & Inconsistency:**
   - Manual grading of diverse question formats is slow and prone to subjective variation across evaluators.
3. **Rigid Scoring Rules:**
   - Naive systems hardcode scoring algorithms, making it difficult to support strict grading, negative penalties, or partial credit across different academic subjects.
4. **Poor Architectural Modularity:**
   - Many student systems use monolithic scripts that tightly couple presentation, business rules, and storage, violating Open/Closed and Single Responsibility principles.

**Speaker Notes:**
- We identified four primary bottlenecks: data fragmentation, evaluation delays, scoring inflexibility, and poor architectural coupling. Our objective was to resolve all four through clean software engineering.

---

## Slide 5: Project Objectives

### Primary Functional & Technical Goals

- **Objective 1: Centralized Digital Assessment Portal**
  - Provide a single web dashboard for scheduled examinations across multiple university subjects (Computer Networks, Operating Systems, Database Systems).
- **Objective 2: Demonstrate the 4 Pillars of OOP**
  - Implement Encapsulation, Inheritance, Polymorphism, and Abstraction in backend domain models and services.
- **Objective 3: Implement 4 Classic GoF Design Patterns**
  - Integrate Strategy Pattern (grading policies), Factory Pattern (question generation), Observer Pattern (event broadcasting), and Builder Pattern (exam construction).
- **Objective 4: Differentiated Role Workflows**
  - Support faculty authentication (`teach@aisat.com` / `1-8`) alongside a frictionless candidate modal requiring Full Name and University Roll Number.
- **Objective 5: Real-Time Assessment & Performance Analytics**
  - Deliver synchronized digital countdown timers, question palettes, automated scoring, radial dials, and academic class leaderboards.

**Speaker Notes:**
- Our objectives combine functional completeness for students and faculty with strict academic requirements for the PECMT535 OOPS curriculum.

---

## Slide 6: Alignment with Course Outcomes & SDGs

### Academic Curriculum & Societal Mapping

**Course Outcomes (COs) - PECMT535:**
- **CO1 (K2):** Explain structure and workflow of the online examination platform and its major architectural layers.
- **CO2 (K3):** Apply OOP principles to model exam, user, and submission domains.
- **CO3 (K3):** Use service interfaces, repository abstractions, and DTOs for modular separation of concerns.
- **CO4 (K4):** Analyze submission lifecycles, feedback generation, analytics observers, and event dispatchers.
- **CO5 (K5):** Evaluate functional behavior and usability through systematic test verification.

**United Nations Sustainable Development Goals (SDGs):**
- **SDG 4 (Quality Education):** Standardizes transparent assessments and provides immediate student feedback.
- **SDG 9 (Industry, Innovation & Infrastructure):** Leverages modern, resilient enterprise software architectures.
- **SDG 10 (Reduced Inequalities):** Guarantees identical timing, question distribution, and unbiased automated scoring.
- **SDG 16 (Peace, Justice & Strong Institutions):** Provides immutable submission histories and reproducible grading audits.

**Speaker Notes:**
- The project directly satisfies all five Course Outcomes mapped to Bloom's taxonomy levels K2 through K5, and aligns with UN Sustainable Development Goals 4, 9, 10, and 16.

---

## Slide 7: System Architecture

### Multi-Tier Decoupled Client-Server Architecture

```
+---------------------------------------------------------------+
|               CLIENT LAYER (React 18 + Vite)                  |
|  - Apple HIG Design Tokens & Midnight Glass Theme             |
|  - Sidebar Navigation | Exam Catalog | Live Exam Runner       |
|  - Participant Modal  | Teacher Login| Leaderboard & OOPS View|
+-------------------------------+-------------------------------+
                                | HTTP REST API / JSON (Port 5173 -> 8080)
+-------------------------------v-------------------------------+
|             APPLICATION LAYER (Spring Boot 3.2.5)             |
|                                                               |
|  [REST Controllers] Auth | Exam | Submission | Analytics      |
|  [Service Layer]    ExamService | SubmissionService | UserSvc |
|  [GoF Patterns]     Strategy | Factory | Observer | Builder   |
|  [Domain Models]    BaseEntity -> User, Question, Exam        |
+-------------------------------+-------------------------------+
                                | Decoupled Interface Contract
+-------------------------------v-------------------------------+
|             DATA ACCESS LAYER (Repository Pattern)            |
|  - ExamRepository       -> InMemoryExamRepository             |
|  - UserRepository       -> InMemoryUserRepository             |
|  - SubmissionRepository -> InMemorySubmissionRepository       |
+---------------------------------------------------------------+
```

**Key Architectural Decisions:**
- Strict separation between frontend presentation and backend domain services.
- Dependency Inversion Principle (DIP): high-level services depend on repository interfaces, not concrete implementations.
- Data Transfer Objects (DTOs) enforce strict boundaries across network requests.

**Speaker Notes:**
- The client communicates asynchronously with Spring Boot controllers via JSON REST endpoints. The backend maintains a clean three-layer architecture: Controllers, Service Layer, and Repository Data Access.

---

## Slide 8: The 4 Pillars of OOP in the Codebase

### Translating Theory into Backend Implementation

1. **Encapsulation:**
   - All domain entities (`Exam`, `Question`, `ExamSubmission`, `User`) declare private instance variables.
   - Access is restricted to validated getters, setters, and business methods (`Exam.isPassed()`, `Exam.calculateTotalPoints()`).
   - Invariants (positive durations, non-negative scores, score boundary limits) are enforced within entity boundaries.

2. **Inheritance:**
   - `BaseEntity` (abstract base class providing UUID `id`, `createdAt`, `updatedAt`).
   - `User Hierarchy`: `BaseEntity` -> `User` (abstract) -> `Student` and `Instructor`.
   - `Question Hierarchy`: `BaseEntity` -> `Question` (abstract) -> `MultipleChoiceQuestion`, `TrueFalseQuestion`, `ShortAnswerQuestion`, `CodingQuestion`.

3. **Polymorphism:**
   - Abstract method `public abstract EvaluationResult evaluate(StudentAnswer, GradingStrategy)` declared in `Question`.
   - Each subclass overrides `evaluate(...)` with domain-specific logic, executed via dynamic method dispatch at runtime.
   - `User.getRoleDescription()` overridden polymorphically in `Student` and `Instructor`.

4. **Abstraction:**
   - High-level business contracts separated from concrete logic via interfaces:
     - `ExamService` / `ExamServiceImpl`
     - `SubmissionService` / `SubmissionServiceImpl`
     - `GradingStrategy` / Concrete Strategies
     - `ExamRepository` / `InMemoryExamRepository`

**Speaker Notes:**
- All four classic pillars are thoroughly demonstrated. When evaluating an exam submission, the engine executes `question.evaluate(...)` polymorphically without needing `instanceof` checks or conditional branching.

---

## Slide 9: OOP Deep Dive: Question Hierarchy & Polymorphism

### Polymorphic Evaluation Engine

```
                       +-----------------------+
                       |      BaseEntity       |
                       |  - id, createdAt      |
                       +-----------+-----------+
                                   |
                       +-----------v-----------+
                       |   Question (Abstract) |
                       |  - text, points       |
                       |  + evaluate(): Result |
                       +-----------+-----------+
         +-----------------+-------+-----------------+
         |                 |                         |
+--------v-------+ +-------v-------+ +---------------v+ +--------------v-+
| MultipleChoice | |   TrueFalse   | |  ShortAnswer   | | CodingQuestion |
| - options      | | - boolAnswer  | | - modelAnswer  | | - testCases    |
| + evaluate()   | | + evaluate()  | | + evaluate()   | | + evaluate()   |
+----------------+ +---------------+ +----------------+ +----------------+
```

**Dynamic Method Dispatch Example:**
```java
// SubmissionServiceImpl.java - Pure Polymorphism without type casting:
for (Question question : exam.getQuestions()) {
    StudentAnswer answer = studentAnswerMap.get(question.getId());
    // Dispatches to MultipleChoice, TrueFalse, ShortAnswer, or Coding:
    EvaluationResult result = question.evaluate(answer, exam.getGradingStrategy());
    feedbackList.add(new QuestionFeedback(question, answer, result));
    earnedPoints += result.getPointsAwarded();
}
```

**Speaker Notes:**
- This diagram shows the question hierarchy. The submission service simply calls `question.evaluate()`. Java's JVM resolves the actual subtype method at runtime, fulfilling the Open/Closed Principle: new question types can be added without modifying the submission service.

---

## Slide 10: GoF Pattern 1: Strategy Pattern (Grading)

### Runtime Swappable Scoring Policies

```
                 +--------------------------------+
                 |  <<interface>> GradingStrategy |
                 |  + evaluate(...): Result       |
                 +---------------+----------------+
                                 |
         +-----------------------+-----------------------+
         |                       |                       |
+--------v---------------+ +-----v-----------------+ +---v------------------+
| StrictGradingStrategy  | | NegativeMarkingStrategy | | PartialCreditStrategy  |
| - Full marks or 0.0    | | - Penalty: -0.25 on err | | - Proportional to ratio|
| - Certification tests  | | - Competitive exams     | | - University exams     |
+------------------------+ +-------------------------+ +------------------------+
```

**Implementation Highlights:**
- **StrictGradingStrategy:**
  $$\text{Score} = \begin{cases} P_{\max}, & \text{if fully correct} \\ 0.0, & \text{otherwise} \end{cases}$$
- **NegativeMarkingStrategy:**
  $$\text{Score} = \begin{cases} P_{\max}, & \text{if correct} \\ -0.25 \times P_{\max}, & \text{if incorrect} \\ 0.0, & \text{if skipped} \end{cases}$$
- **PartialCreditStrategy:**
  $$\text{Score} = P_{\max} \times \text{AccuracyRatio}$$

**Speaker Notes:**
- The Strategy Pattern decouples evaluation algorithms from the questions. An exam can swap from strict all-or-nothing grading to negative marking with a single reference change, with zero modifications to question code.

---

## Slide 11: GoF Patterns 2 & 3: Factory & Builder Patterns

### Creational Patterns for Safe & Flexible Object Creation

**1. Factory Method Pattern (`QuestionFactory`):**
- Encapsulates object creation for all question subtypes based on `QuestionType`.
- Prevents client controllers from directly coupling to concrete question constructors.

```java
public class QuestionFactory {
    public static Question createQuestion(QuestionType type, String text, double points, ...) {
        return switch (type) {
            case MULTIPLE_CHOICE -> new MultipleChoiceQuestion(text, points, explanation, options);
            case TRUE_FALSE      -> new TrueFalseQuestion(text, points, explanation, tfAnswer);
            case SHORT_ANSWER    -> new ShortAnswerQuestion(text, points, explanation, modelText);
            case CODING          -> new CodingQuestion(text, points, explanation, template, tests);
        };
    }
}
```

**2. Builder Pattern (`ExamBuilder`):**
- Provides a fluent, readable API to construct complex, multi-question `Exam` instances.
- Verifies business invariants before instantiating the immutable `Exam` entity.

```java
Exam exam = new ExamBuilder()
    .withId("exam-dbms-101")
    .withTitle("Database Management Systems Midterm")
    .withDurationMinutes(30)
    .withGradingStrategy(new StrictGradingStrategy())
    .addQuestion(q1)
    .addQuestion(q2)
    .build(); // Validates positive duration, title presence, and questions
```

**Speaker Notes:**
- The Factory pattern centralizes instantiation of the question hierarchy. The Builder pattern avoids telescoping constructors and enforces that an exam cannot be built without valid duration and questions.

---

## Slide 12: GoF Pattern 4: Observer Pattern (Events)

### Decoupled Asynchronous Assessment Event Broadcasting

```
+---------------------------------------------------------------+
|            Subject: ExamEventPublisher (Singleton)            |
|  - observers: List<ExamObserver>                              |
|  + registerObserver(observer)                                 |
|  + publishEvent(ExamEvent event)                              |
+-------------------------------+-------------------------------+
                                |
             Broadcasting: EXAM_STARTED | EXAM_SUBMITTED | EXAM_GRADED
                                |
         +----------------------+----------------------+
         |                                             |
+--------v-------------------+             +-----------v--------------------+
|   AnalyticsObserver        |             |      NotificationObserver      |
|  - Updates class averages  |             |  - Logs audit trail            |
|  - Refreshes pass rates    |             |  - Alerts faculty on submits   |
+----------------------------+             +--------------------------------+
```

**Key Advantages:**
- Loosely coupled: the `SubmissionService` does not need to know about logging or analytics services.
- Extensibility: new observers (such as SMS or email notifications) can subscribe without changing existing code.

**Speaker Notes:**
- We implemented the Observer pattern so that when an exam is submitted or graded, multiple downstream systems (analytics calculators and administrative loggers) react autonomously without coupling to the submission engine.

---

## Slide 13: Functional Modules & User Roles

### Dual-Role Architecture: Students & Faculty

**1. Candidate / Student Flow:**
- **Zero Friction Onboarding:** Candidate clicks "Take Exam" or an exam link; enters **Full Name** and **Roll Number** (e.g., `Rinzan N.P`, `AIK24AM050`).
- **Synchronized Live Runner:** Digital countdown timer with color warnings (amber under 5 min, danger pulse under 1 min).
- **Interactive Question Palette:** Visual indicator of answered, unanswered, marked-for-review, and active questions.
- **Instant Result Dial:** Radial SVG score wheel, percentage, pass/fail status, and question-level feedback with model solutions.

**2. Faculty / Instructor Flow:**
- **Secure Authentication:** Institutional login with `teach@aisat.com` and password `1-8`.
- **Instructor Studio:** Form to author custom examinations using the `QuestionFactory`.
- **Class Leaderboard:** Ranked student submissions sorted by points and completion time.
- **Analytics Overview:** Class average scores, total submissions, and pass percentages.

**Speaker Notes:**
- The system supports both ends of the academic spectrum. Candidates face no confusing onboarding, while faculty members have authenticated controls over exam creation and class-wide analytics.

---

## Slide 14: Frontend Design & Apple HIG Aesthetic

### Distraction-Free, Enterprise UI/UX

- **Design Philosophy:** Clean Apple Human Interface Guidelines (HIG).
- **Zero Emojis:** Strictly professional, academic appearance using Lucide-React SVG vector icons.
- **Frosted Glassmorphism:** Custom CSS design tokens with `backdrop-filter: blur(20px)`, dark midnight backgrounds (`#0d1117`), and subtle indigo accents (`#6366f1`).
- **Responsive Navigation:** Fluid split-view sidebar supporting catalog exploration, class leaderboard, teacher authentication, and OOPS inspection.
- **Accessibility:** High contrast text ratios, explicit focus rings, keyboard navigability, and responsive layouts across all device viewports.

**Design Tokens:**
- Surface: `rgba(22, 27, 34, 0.75)`
- Border: `rgba(255, 255, 255, 0.08)`
- System Typography: `-apple-system, BlinkMacSystemFont, "Inter", sans-serif`

**Speaker Notes:**
- Unlike generic student portals filled with bright colors and emojis, our interface follows Apple HIG principles. The interface stays out of the student's way during timed assessments.

---

## Slide 15: Application Walkthrough: Catalog & Participant Modal

### Screenshots: Figures 8.1 & 8.2

**1. Examination Catalog (Figure 8.1):**
- Displays exam cards with subject tags, durations, question counts, and active grading strategy badges.
- Top metrics banner summarizes available exams, total submissions, average score, and pass rate.

**2. Candidate Verification Modal (Figure 8.2):**
- Two-field dialog prompting for Full Name and University Roll Number.
- Submits `POST /api/exams/{id}/start` to initialize candidate state.

```
+-----------------------------------------------------------+
|  [ AISAT Online Examination System ]       Teacher Login  |
+-----------------------------------------------------------+
|  Available Exams: 3   Submissions: 24   Avg: 78%  Pass: 88%|
+-----------------------------------------------------------+
|  [ Computer Networks ]     [ Operating Systems ]          |
|  25 min | 4 points         45 min | 14 points             |
|  Partial Credit            Negative Marking (-0.25)       |
|  [ Start Exam -> ]         [ Start Exam -> ]              |
+-----------------------------------------------------------+
```

**Speaker Notes:**
- On the left is our primary dashboard with subject filter pills and search bar. On the right is the candidate modal that launches the timed exam.

---

## Slide 16: Application Walkthrough: Runner & Leaderboard

### Screenshots: Figures 8.3 & 8.4

**1. Live Assessment Runner (Figure 8.3):**
- Question palette sidebar with color-coded status badges:
  - Green = Answered, Purple = Marked for Review, Gray = Unattempted.
- Countdown timer anchored at the top right with auto-submit safeguard.
- Polymorphic question inputs (radios, checkboxes, text boxes, coding templates).

**2. Academic Class Leaderboard (Figure 8.4):**
- Sorted rank table displaying Gold, Silver, Bronze badges.
- Records student name, roll number, points, score percentage, and duration taken.

```
+-----------------------------------------------------------+
| Q1 of 5   [Mark for Review]           Time Left: 24:18    |
+-----------------------------------------------------------+
| Which transport layer protocol provides reliable,         |
| connection-oriented byte stream delivery?                 |
|   (o) TCP (Transmission Control Protocol)                 |
|   ( ) UDP (User Datagram Protocol)                        |
|   ( ) ICMP                                                |
| [ < Previous ]                           [ Next Question >]|
+-----------------------------------------------------------+
```

**Speaker Notes:**
- Here is the live exam runner. Notice the countdown timer and question palette. On submission, the student receives their radial scorecard, and their entry is ranked on the class leaderboard.

---

## Slide 17: Application Walkthrough: Teacher Login & OOPS Visualizer

### Screenshots: Figures 8.5 & 8.6

**1. Faculty Authentication (Figure 8.5):**
- Verified credentials: `teach@aisat.com` with password `1-8`.
- Unlocks instructor privileges and the exam creation studio.

**2. OOPS Architecture Explorer (Figure 8.6):**
- Built directly into the application interface for viva demonstrations.
- Maps UI actions to the 4 Pillars of OOP and the 4 GoF Design Patterns.
- Clicking any pattern highlights the responsible Java classes and packages.

**Viva Demonstration Benefit:**
- Committee members can verify that architectural concepts are actively running in the Java backend rather than existing solely as theoretical diagrams.

**Speaker Notes:**
- The teacher authentication unlocks administrative tools. The built-in OOPS Architecture Explorer was designed specifically for our project evaluation, letting the committee inspect the Java classes behind every UI feature.

---

## Slide 18: Testing & Verification Results

### Systematic Validation Across 15 Test Cases

| Test ID | Test Scenario | Verified Behavior | Status |
| :---: | :--- | :--- | :---: |
| **TC-01** | Load Exam Catalog | HTTP 200 with active exams, points, and grading strategies | **PASSED** |
| **TC-02** | Filter Exams by Subject | Correctly isolates exams matching subject pill selection | **PASSED** |
| **TC-03** | Keyword Search | Matches exam titles dynamically | **PASSED** |
| **TC-04** | Candidate Registration | Registers name and roll number; starts session | **PASSED** |
| **TC-05** | Form Validation | Blocks empty name or roll number with alert prompt | **PASSED** |
| **TC-06** | Faculty Login (Valid) | Authenticates `teach@aisat.com` / `1-8`; returns Instructor profile | **PASSED** |
| **TC-07** | Faculty Login (Invalid) | Returns HTTP 401 Unauthorized with error payload | **PASSED** |
| **TC-08** | Digital Countdown Timer | Decrements synchronously; triggers auto-submit at 00:00 | **PASSED** |
| **TC-09** | Question Palette State | Reflects answered, unanswered, and reviewed question states | **PASSED** |
| **TC-10** | Strict Strategy Grading | Awards full marks for correct; 0.0 for any error | **PASSED** |
| **TC-11** | Negative Marking Deductions | Correctly deducts 25% penalty for incorrect responses | **PASSED** |
| **TC-12** | Partial Credit Proportions | Calculates proportional points based on selected options | **PASSED** |
| **TC-13** | Leaderboard Rank Sorting | Sorts submissions by score (descending) and time (ascending) | **PASSED** |
| **TC-14** | Observer Event Broadcast | Triggers analytics recalculation and audit logging on submit | **PASSED** |
| **TC-15** | ExamBuilder Validation | Throws `IllegalStateException` on negative duration/empty exam | **PASSED** |

**Speaker Notes:**
- We executed 15 comprehensive unit and integration test cases covering authentication, timer countdowns, strategy calculations, observer dispatch, and builder validation. All tests passed.

---

## Slide 19: System Limitations

### Honest Assessment of Current Implementation Scope

1. **In-Memory Storage Abstraction:**
   - The current data access layer utilizes thread-safe in-memory maps (`ConcurrentHashMap`). While fast and suitable for project demonstrations, data resets on server restart.
2. **Automated Proctoring Controls:**
   - The platform does not currently include webcam face tracking, audio anomaly detection, or locked-down browser tabs.
3. **Subjective Evaluation Limitations:**
   - Short-answer questions rely on model-answer keyword heuristics rather than full natural language semantic understanding.
4. **Client-Side Cache Resilience:**
   - In the event of an extended network outage, unsubmitted responses in memory could be lost if the user manually reloads the browser tab.

**Speaker Notes:**
- We acknowledge four current boundaries: in-memory persistence, basic anti-cheating controls, keyword-based short answer evaluation, and local storage resilience. These define our roadmap for future development.

---

## Slide 20: Future Scope & Enhancements

### Planned Technical Evolution

- **1. Production Relational Database:**
  - Transition from in-memory repositories to **PostgreSQL** via **Spring Data JPA / Hibernate**, incorporating Flyway schema migrations.
- **2. Automated Code Execution Sandbox:**
  - Expand `CodingQuestion` evaluation by executing submissions inside isolated **Docker containers** with unit test assertions.
- **3. AI-Assisted Semantic Evaluation:**
  - Integrate lightweight Large Language Models (LLMs) to grade descriptive answers semantically and provide qualitative feedback.
- **4. Offline PWA & Autosave:**
  - Use Service Workers and IndexedDB to autosave candidate answers locally every 5 seconds, protecting against network drops.
- **5. Spring Security & JWT:**
  - Implement stateless JSON Web Token (JWT) role-based access control with refresh tokens and multi-factor authentication.

**Speaker Notes:**
- Because our architecture is strictly decoupled, migrating to PostgreSQL simply requires writing a new JPA implementation of the `ExamRepository` interface, with zero changes to business services or controllers.

---

## Slide 21: Conclusion & Key Learnings

### Summary of Achievements

- **Curricular Success:** Successfully designed, implemented, and verified an Online Examination System fulfilling all requirements of *PECMT535 Object Oriented Programming Concepts*.
- **Pure OOP in Practice:**
  - Encapsulated domain entities preserving business invariants.
  - Inheritance hierarchies rooted in `BaseEntity`.
  - Polymorphic evaluation dispatched dynamically at runtime.
  - Interface-driven abstractions decoupling services and repositories.
- **GoF Patterns Mastered:**
  - Strategy Pattern for swappable grading rules.
  - Factory Pattern for encapsulated question creation.
  - Observer Pattern for decoupled event notifications.
  - Builder Pattern for fluent exam construction.
- **Production-Grade Delivery:**
  - Seamless full-stack integration between Java 17 Spring Boot and React 18.
  - Clean, distraction-free Apple HIG aesthetic with zero emojis.

**Speaker Notes:**
- In conclusion, our project demonstrates that object-oriented principles are not just textbook concepts, but practical tools for building modular, maintainable, and extensible software. Thank you.

---

## Slide 22: References

### Academic, Technical & Institutional Citations

1. Oracle Corporation, *Java Platform Standard Edition Documentation (JDK 17 LTS)*, 2023. Available: `https://docs.oracle.com/en/java/javase/17/`
2. Gamma, E., Helm, R., Johnson, R., and Vlissides, J., *Design Patterns: Elements of Reusable Object-Oriented Software*, Addison-Wesley, 1994.
3. Walls, C., *Spring in Action, Sixth Edition*, Manning Publications, 2022.
4. React Development Team, *React Documentation: Modern Client-Side UI Architecture*, 2024. Available: `https://react.dev/`
5. Fowler, M., *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002.
6. Bloch, J., *Effective Java, Third Edition*, Addison-Wesley, 2018.
7. Apple Inc., *Human Interface Guidelines: Desktop and Web Design Systems*, 2024. Available: `https://developer.apple.com/design/human-interface-guidelines/`
8. APJ Abdul Kalam Technological University, *Course Syllabus: PECMT535 Object Oriented Programming Concepts*, Thiruvananthapuram, Kerala.

---

## Slide 23: Question & Answer (Q&A)

### Thank You

**ONLINE EXAMINATION SYSTEM**  
*PECMT535 Object Oriented Programming Concepts Project Evaluation*

**Project Team:**
- Rinzan N.P (`AIK24AM050`)
- Dinah Mohammed (`AIK24AM025`)

**Faculty Guide:** Ms. Ashwathy Anda Chacko  
**Department:** Artificial Intelligence and Machine Learning  
**Institution:** Albertian Institute of Science and Technology - AISAT (Autonomous), Kalamassery

*We welcome questions and feedback from the Evaluation Committee.*

**Speaker Notes:**
- We are now ready to take any questions regarding our architecture, design patterns, or live codebase.
