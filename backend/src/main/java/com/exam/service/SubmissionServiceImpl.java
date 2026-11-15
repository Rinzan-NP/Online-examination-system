package com.exam.service;

import com.exam.dto.LeaderboardEntryDto;
import com.exam.dto.SubmitExamRequest;
import com.exam.model.exam.Exam;
import com.exam.model.question.EvaluationResult;
import com.exam.model.question.MultipleChoiceQuestion;
import com.exam.model.question.Question;
import com.exam.model.submission.ExamSubmission;
import com.exam.model.submission.QuestionFeedback;
import com.exam.model.submission.StudentAnswer;
import com.exam.model.user.Student;
import com.exam.model.user.User;
import com.exam.oop.observer.ExamEvent;
import com.exam.oop.observer.ExamEventPublisher;
import com.exam.oop.strategy.GradingStrategy;
import com.exam.repository.ExamRepository;
import com.exam.repository.SubmissionRepository;
import com.exam.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final ExamEventPublisher eventPublisher;

    public SubmissionServiceImpl(SubmissionRepository submissionRepository,
                                 ExamRepository examRepository,
                                 UserRepository userRepository,
                                 ExamEventPublisher eventPublisher) {
        this.submissionRepository = submissionRepository;
        this.examRepository = examRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public ExamSubmission startAttempt(String examId, String studentId) {
        return startAttempt(examId, studentId, null, null);
    }

    @Override
    public ExamSubmission startAttempt(String examId, String studentId, String studentName, String studentRollNo) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found: " + examId));

        User user = (studentId != null) ? userRepository.findById(studentId).orElse(null) : null;

        String resolvedName = (studentName != null && !studentName.trim().isEmpty())
                ? studentName.trim()
                : (user != null ? user.getName() : "Student Candidate");

        String resolvedRoll = (studentRollNo != null && !studentRollNo.trim().isEmpty())
                ? studentRollNo.trim()
                : ((user instanceof Student) ? ((Student) user).getRollNumber() : "CAND-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase());

        String resolvedId = (studentId != null && !studentId.trim().isEmpty())
                ? studentId
                : "STU-" + UUID.randomUUID().toString().substring(0, 8);

        String subId = "SUB-" + UUID.randomUUID().toString().substring(0, 8);
        ExamSubmission submission = new ExamSubmission(subId, exam.getId(), exam.getTitle(), resolvedId, resolvedName, resolvedRoll);
        ExamSubmission saved = submissionRepository.save(submission);

        eventPublisher.publishEvent(new ExamEvent(
                ExamEvent.EventType.EXAM_STARTED,
                exam.getId(),
                exam.getTitle(),
                resolvedId,
                resolvedName,
                0.0
        ));

        return saved;
    }

    @Override
    public ExamSubmission submitAndEvaluate(String examId, SubmitExamRequest request) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found: " + examId));

        String studentId = request.getStudentId() != null ? request.getStudentId() : "STUDENT-001";
        User user = userRepository.findById(studentId).orElse(null);

        String resolvedName = (request.getStudentName() != null && !request.getStudentName().trim().isEmpty())
                ? request.getStudentName().trim()
                : (user != null ? user.getName() : "Student Candidate");

        String resolvedRoll = (request.getStudentRollNo() != null && !request.getStudentRollNo().trim().isEmpty())
                ? request.getStudentRollNo().trim()
                : ((user instanceof Student) ? ((Student) user).getRollNumber() : "CAND-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase());

        // Map candidate answers by question ID
        Map<String, StudentAnswer> answerMap = new HashMap<>();
        if (request.getAnswers() != null) {
            for (StudentAnswer ans : request.getAnswers()) {
                if (ans.getQuestionId() != null) {
                    answerMap.put(ans.getQuestionId(), ans);
                }
            }
        }

        GradingStrategy strategy = exam.getGradingStrategy();
        double totalAwarded = 0.0;
        double totalPossible = exam.calculateTotalMarks();
        List<QuestionFeedback> feedbackList = new ArrayList<>();

        // Polymorphic Dynamic Dispatch across questions
        for (Question question : exam.getQuestions()) {
            StudentAnswer studentAnswer = answerMap.get(question.getId());
            EvaluationResult evalResult = question.evaluate(studentAnswer, strategy);

            totalAwarded += evalResult.getScoreAwarded();

            Object answerSummary = "Unattempted";
            if (studentAnswer != null && studentAnswer.isAttempted()) {
                if (studentAnswer.getSelectedOptionIndices() != null && !studentAnswer.getSelectedOptionIndices().isEmpty()) {
                    if (question instanceof MultipleChoiceQuestion) {
                        MultipleChoiceQuestion mcq = (MultipleChoiceQuestion) question;
                        List<String> chosenLabels = new ArrayList<>();
                        for (int idx : studentAnswer.getSelectedOptionIndices()) {
                            if (idx >= 0 && idx < mcq.getOptions().size()) {
                                char letter = (char) ('A' + idx);
                                chosenLabels.add(letter + ": " + mcq.getOptions().get(idx).getText());
                            } else {
                                chosenLabels.add(String.valueOf(idx));
                            }
                        }
                        answerSummary = String.join(", ", chosenLabels);
                    } else {
                        answerSummary = studentAnswer.getSelectedOptionIndices();
                    }
                } else if (studentAnswer.getBooleanAnswer() != null) {
                    answerSummary = studentAnswer.getBooleanAnswer() ? "True" : "False";
                } else if (studentAnswer.getTextAnswer() != null) {
                    answerSummary = studentAnswer.getTextAnswer();
                } else if (studentAnswer.getCodeAnswer() != null) {
                    answerSummary = studentAnswer.getCodeAnswer();
                }
            }

            feedbackList.add(new QuestionFeedback(
                    question.getId(),
                    question.getText(),
                    question.getQuestionType(),
                    answerSummary,
                    evalResult.getCorrectSolution(),
                    evalResult.isCorrect(),
                    evalResult.getScoreAwarded(),
                    evalResult.getMaxScore(),
                    evalResult.getFeedback(),
                    question.getExplanation()
            ));
        }

        // Clamp minimum score to 0 to avoid negative cumulative totals for students
        totalAwarded = Math.max(0.0, totalAwarded);
        boolean passed = exam.isPassed(totalAwarded);

        String subId = "SUB-" + UUID.randomUUID().toString().substring(0, 8);
        ExamSubmission submission = new ExamSubmission(subId, exam.getId(), exam.getTitle(), studentId, resolvedName, resolvedRoll);
        submission.setAnswers(request.getAnswers());
        submission.setTimeTakenSeconds(request.getTimeTakenSeconds());
        submission.completeEvaluation(totalAwarded, totalPossible, passed, feedbackList);

        ExamSubmission saved = submissionRepository.save(submission);

        // Dispatches exam submission & grading event (Observer pattern)
        eventPublisher.publishEvent(new ExamEvent(
                ExamEvent.EventType.EXAM_SUBMITTED,
                exam.getId(),
                exam.getTitle(),
                studentId,
                resolvedName,
                totalAwarded
        ));

        eventPublisher.publishEvent(new ExamEvent(
                ExamEvent.EventType.EXAM_GRADED,
                exam.getId(),
                exam.getTitle(),
                studentId,
                resolvedName,
                totalAwarded
        ));

        return saved;
    }

    @Override
    public Optional<ExamSubmission> getSubmissionById(String submissionId) {
        return submissionRepository.findById(submissionId);
    }

    @Override
    public List<ExamSubmission> getSubmissionsByStudent(String studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    @Override
    public List<ExamSubmission> getSubmissionsByExam(String examId) {
        return submissionRepository.findByExamId(examId);
    }

    @Override
    public List<LeaderboardEntryDto> getExamLeaderboard(String examId) {
        List<ExamSubmission> subs = submissionRepository.findByExamId(examId);

        // Sort by score descending, then by time taken ascending
        subs.sort((a, b) -> {
            int scoreCompare = Double.compare(b.getTotalScoreAwarded(), a.getTotalScoreAwarded());
            if (scoreCompare != 0) return scoreCompare;
            return Long.compare(a.getTimeTakenSeconds(), b.getTimeTakenSeconds());
        });

        AtomicInteger rankCounter = new AtomicInteger(1);
        return subs.stream()
                .map(s -> new LeaderboardEntryDto(
                        rankCounter.getAndIncrement(),
                        s.getStudentId(),
                        s.getStudentName(),
                        s.getStudentRollNo(),
                        s.getTotalScoreAwarded(),
                        s.getTotalPossibleScore(),
                        s.getPercentage(),
                        s.getTimeTakenSeconds(),
                        s.isPassed()
                ))
                .collect(Collectors.toList());
    }
}
