# Online Examination System (College OOPS Project)

An enterprise-grade **Online Examination System** developed for the **Object-Oriented Programming Systems (OOPS)** college course curriculum. Built with a robust **Java (Spring Boot)** backend demonstrating pure OOPS design principles and design patterns, paired with a modern, responsive **React** frontend.

---

## 🏛️ Object-Oriented Software Architecture (Backend)

The backend showcases all foundational OOPS principles and Gang-of-Four (GoF) design patterns:

### 1. The 4 Pillars of OOP

- **Encapsulation**:
  - All domain models (`Exam`, `Question`, `StudentAnswer`, `ExamSubmission`, `User`) protect internal state using `private` attributes.
  - Access is provided via validated getter and setter methods and domain-driven operations (e.g., `Exam.isPassed()`, `Exam.setDurationMinutes()`).
  - Business invariants (e.g., non-negative scores, duration limits, valid option bounds) are strictly preserved within entities.

- **Inheritance**:
  - **Entity Hierarchy**: `BaseEntity` (abstract base with `id`, `createdAt`, `updatedAt`).
  - **User Hierarchy**: `BaseEntity` → `User` (abstract) → `Student` (roll number, semester, branch) and `Instructor` (department, designation, faculty code).
  - **Question Hierarchy**: `BaseEntity` → `Question` (abstract) →:
    1. `MultipleChoiceQuestion` (single-select or multi-select options)
    2. `TrueFalseQuestion` (boolean evaluation)
    3. `ShortAnswerQuestion` (keyword & model answer matching)
    4. `CodingQuestion` (automated test case evaluation & code analysis)

- **Polymorphism (Dynamic Method Dispatch)**:
  - `Question.evaluate(StudentAnswer, GradingStrategy)` is an abstract method overridden by each question subtype. When an exam is submitted, the system calls `question.evaluate(...)` polymorphically without needing conditional `instanceof` branching.
  - `User.getRoleDescription()` returns specialized role representations polymorphically.

- **Abstraction**:
  - Abstract classes define high-level contracts: `BaseEntity`, `User`, `Question`.
  - Service & Repository interfaces decouple business logic from storage:
    - `ExamService`, `SubmissionService`, `UserService`
    - `ExamRepository`, `SubmissionRepository`, `UserRepository`
    - `GradingStrategy`

---

### 2. GoF Design Patterns Implemented

| Pattern | Implementation | Purpose |
| :--- | :--- | :--- |
| **Strategy Pattern** | `GradingStrategy` interface (`StrictGradingStrategy`, `NegativeMarkingStrategy`, `PartialCreditStrategy`) | Allows dynamic swapping of scoring algorithms at runtime (e.g., penalties for wrong answers vs partial credit) without modifying exam logic. |
| **Factory Pattern** | `QuestionFactory` (`com.exam.oop.factory`) | Encapsulates the instantiation of polymorphic `Question` subclasses based on question types and parameters. |
| **Observer Pattern** | `ExamEventPublisher` (Subject), `ExamObserver` (Interface), `NotificationObserver`, `AnalyticsObserver` | Broadcasts real-time events (`EXAM_STARTED`, `EXAM_SUBMITTED`, `EXAM_GRADED`) to decoupled logging, notification, and live metrics services. |
| **Builder Pattern** | `ExamBuilder` (`com.exam.model.exam`) | Fluent API for constructing complex, multi-question `Exam` instances with invariant validation before building. |
| **Repository Pattern** | `InMemoryExamRepository`, `InMemoryUserRepository`, `InMemorySubmissionRepository` | Decouples data access from business domain logic (SOLID Dependency Inversion Principle). |

---

## 📁 Project Directory Structure

```
Online examination system/
├── backend/
│   ├── build.gradle
│   ├── settings.gradle
│   ├── gradlew & gradlew.bat
│   └── src/main/java/com/exam/
│       ├── OnlineExamApplication.java         # Spring Boot Entry Point
│       ├── config/
│       │   ├── CorsConfig.java                # CORS config for React frontend
│       │   └── DataInitializer.java           # Pre-seeds real college exams & users
│       ├── controller/
│       │   ├── AuthController.java            # Auth & Role switching REST API
│       │   ├── ExamController.java            # Exam CRUD & Question endpoints
│       │   ├── SubmissionController.java      # Exam taking, timer, evaluation endpoints
│       │   └── AnalyticsController.java       # Class statistics & Leaderboard API
│       ├── dto/                               # Data Transfer Objects
│       ├── model/
│       │   ├── BaseEntity.java                # Abstract base entity
│       │   ├── exam/ (Exam, ExamBuilder, ExamStatus)
│       │   ├── question/ (Question, MCQ, TrueFalse, ShortAnswer, CodingQuestion, TestCase)
│       │   ├── submission/ (ExamSubmission, StudentAnswer, QuestionFeedback)
│       │   └── user/ (User, Student, Instructor, UserRole)
│       ├── oop/
│       │   ├── factory/ (QuestionFactory)
│       │   ├── observer/ (ExamEventPublisher, ExamObserver, NotificationObserver, AnalyticsObserver)
│       │   └── strategy/ (GradingStrategy, Strict, NegativeMarking, PartialCredit)
│       ├── repository/                        # Repository Interfaces & In-Memory Stores
│       └── service/                           # Business Service Layer & Implementations
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx                            # Master state & route manager
        ├── api.js                             # Fetch client connecting to Spring Boot
        ├── index.css                          # Modern midnight & indigo design tokens
        └── components/
            ├── Navbar.jsx                     # Header with navigation & role switcher
            ├── ExamList.jsx                   # Available exams, filters & stats banner
            ├── ExamCard.jsx                   # Exam preview card with duration & marks
            ├── ExamRunner.jsx                 # Live test runner, countdown timer, question palette
            ├── ExamResult.jsx                 # Score card & in-depth question feedback
            ├── LeaderboardView.jsx            # Class rankings with Gold/Silver/Bronze medals
            ├── ExamCreator.jsx                # Instructor studio for creating custom exams
            └── OopsInspector.jsx              # Interactive college viva OOPS visualizer
```

---

## 🚀 Running the Project

### Prerequisites
- **Java 17+**
- **Node.js (v18+) & npm**

### 1. Run the Java Backend
Open a terminal in the project directory:
```bash
cd backend
./gradlew bootRun
```
The REST API will be live at `http://localhost:8080/api`.

### 2. Run the React Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173/`.

---

## 🎯 Key Application Features

1. **Role Switching (Student ↔ Instructor)**:
   - One-click toggle in the header between **Alex Mercer (Student)** and **Dr. Sarah Mitchell (Instructor)** to test both user workflows.
2. **Interactive Exam Taking**:
   - Live digital countdown timer with amber (<5 min) and danger pulse (<1 min) alerts.
   - Question palette sidebar with status indicators (Answered, Marked for Review, Unanswered, Active).
   - Polymorphic question interfaces:
     - Multi-Choice Question (single or multiple select)
     - True / False toggle
     - Short Answer text box
     - Coding problem with starter template and "Run Test Cases" simulation button.
3. **Instant Evaluation & Detailed Review**:
   - Automated grading applying the exam's specific strategy (Strict, Negative Marking, or Partial Credit).
   - Radial score dial, percentage, pass/fail status, time taken.
   - Question-by-question review showing submitted answer, model solution, explanation, and marks awarded.
4. **Academic Leaderboard**:
   - View top class rankings by score, percentage, and time taken.
5. **Exam Creator Studio**:
   - Instructors can create exams and add diverse questions using the Question Factory.
6. **OOPS Architecture Explorer Tab**:
   - Built-in visualizer detailing the 4 Pillars of OOP and GoF Design Patterns mapped directly to backend Java classes for project demonstration and college vivas.
