package com.exam.service;

import com.exam.dto.CreateExamRequest;
import com.exam.dto.ExamSummaryDto;
import com.exam.dto.QuestionDto;
import com.exam.model.exam.Exam;
import com.exam.model.exam.ExamBuilder;
import com.exam.model.exam.ExamStatus;
import com.exam.model.question.Question;
import com.exam.oop.factory.QuestionFactory;
import com.exam.oop.observer.ExamEvent;
import com.exam.oop.observer.ExamEventPublisher;
import com.exam.repository.ExamRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final QuestionFactory questionFactory;
    private final ExamEventPublisher eventPublisher;

    public ExamServiceImpl(ExamRepository examRepository, QuestionFactory questionFactory, ExamEventPublisher eventPublisher) {
        this.examRepository = examRepository;
        this.questionFactory = questionFactory;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public Exam createExam(CreateExamRequest request) {
        ExamBuilder builder = new ExamBuilder()
                .withTitle(request.getTitle())
                .withDescription(request.getDescription())
                .withSubject(request.getSubject())
                .withInstructor(request.getInstructorId(), request.getInstructorName())
                .withDuration(request.getDurationMinutes())
                .withPassingPercentage(request.getPassingPercentage())
                .withStatus(request.getStatus() != null ? request.getStatus() : ExamStatus.ACTIVE)
                .withGradingStrategy(request.getGradingStrategyType())
                .withInstructions(request.getInstructions());

        if (request.getQuestions() != null) {
            for (QuestionDto qDto : request.getQuestions()) {
                Question question = convertDtoToQuestion(qDto);
                if (question != null) {
                    builder.addQuestion(question);
                }
            }
        }

        Exam exam = builder.build();
        Exam saved = examRepository.save(exam);

        // Notify observers (Observer Pattern)
        eventPublisher.publishEvent(new ExamEvent(
                ExamEvent.EventType.EXAM_CREATED,
                saved.getId(),
                saved.getTitle(),
                null,
                saved.getInstructorName(),
                0.0
        ));

        return saved;
    }

    @Override
    public Optional<Exam> getExamById(String id) {
        return examRepository.findById(id);
    }

    @Override
    public List<ExamSummaryDto> getAllExamSummaries() {
        return examRepository.findAll().stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExamSummaryDto> getExamsByStatus(ExamStatus status) {
        return examRepository.findByStatus(status).stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExamSummaryDto> getExamsBySubject(String subject) {
        return examRepository.findBySubject(subject).stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    public Exam updateExam(String id, CreateExamRequest request) {
        Optional<Exam> existingOpt = examRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new IllegalArgumentException("Exam not found with id: " + id);
        }

        Exam existing = existingOpt.get();
        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setSubject(request.getSubject());
        existing.setDurationMinutes(request.getDurationMinutes());
        existing.setPassingPercentage(request.getPassingPercentage());
        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }
        if (request.getGradingStrategyType() != null) {
            existing.setGradingStrategyType(request.getGradingStrategyType());
        }
        existing.setInstructions(request.getInstructions());

        if (request.getQuestions() != null) {
            List<Question> updatedQuestions = new ArrayList<>();
            for (QuestionDto qDto : request.getQuestions()) {
                Question q = convertDtoToQuestion(qDto);
                if (q != null) {
                    updatedQuestions.add(q);
                }
            }
            existing.setQuestions(updatedQuestions);
        }

        return examRepository.save(existing);
    }

    @Override
    public boolean deleteExam(String id) {
        if (examRepository.findById(id).isPresent()) {
            examRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Question addQuestionToExam(String examId, QuestionDto questionDto) {
        Optional<Exam> examOpt = examRepository.findById(examId);
        if (examOpt.isEmpty()) {
            throw new IllegalArgumentException("Exam not found: " + examId);
        }

        Question question = convertDtoToQuestion(questionDto);
        if (question == null) {
            throw new IllegalArgumentException("Invalid question type specified");
        }

        Exam exam = examOpt.get();
        exam.addQuestion(question);
        examRepository.save(exam);
        return question;
    }

    @Override
    public Question convertDtoToQuestion(QuestionDto dto) {
        if (dto == null || dto.getQuestionType() == null) {
            return null;
        }

        switch (dto.getQuestionType()) {
            case MULTIPLE_CHOICE:
                return questionFactory.createMultipleChoiceQuestion(
                        dto.getText(),
                        dto.getMarks(),
                        dto.getPenaltyMarks(),
                        dto.getExplanation(),
                        dto.getDifficulty(),
                        dto.getTopic(),
                        dto.getOptions(),
                        dto.isAllowMultiple()
                );
            case TRUE_FALSE:
                boolean answer = dto.getBooleanAnswer() != null && dto.getBooleanAnswer();
                return questionFactory.createTrueFalseQuestion(
                        dto.getText(),
                        dto.getMarks(),
                        dto.getPenaltyMarks(),
                        dto.getExplanation(),
                        dto.getDifficulty(),
                        dto.getTopic(),
                        answer
                );
            case SHORT_ANSWER:
                return questionFactory.createShortAnswerQuestion(
                        dto.getText(),
                        dto.getMarks(),
                        dto.getPenaltyMarks(),
                        dto.getExplanation(),
                        dto.getDifficulty(),
                        dto.getTopic(),
                        dto.getModelAnswer(),
                        dto.getAcceptedKeywords(),
                        dto.isCaseSensitive()
                );
            case CODING:
                return questionFactory.createCodingQuestion(
                        dto.getText(),
                        dto.getMarks(),
                        dto.getPenaltyMarks(),
                        dto.getExplanation(),
                        dto.getDifficulty(),
                        dto.getTopic(),
                        dto.getLanguage(),
                        dto.getStarterCode(),
                        dto.getExpectedSolution(),
                        dto.getTestCases()
                );
            default:
                return null;
        }
    }

    @Override
    public ExamSummaryDto mapToSummaryDto(Exam exam) {
        ExamSummaryDto summary = new ExamSummaryDto();
        summary.setId(exam.getId());
        summary.setTitle(exam.getTitle());
        summary.setDescription(exam.getDescription());
        summary.setSubject(exam.getSubject());
        summary.setInstructorName(exam.getInstructorName());
        summary.setDurationMinutes(exam.getDurationMinutes());
        summary.setPassingPercentage(exam.getPassingPercentage());
        summary.setStatus(exam.getStatus());
        summary.setGradingStrategyType(exam.getGradingStrategyType());
        summary.setQuestionCount(exam.getQuestions() != null ? exam.getQuestions().size() : 0);
        summary.setTotalMarks(exam.calculateTotalMarks());
        return summary;
    }
}
