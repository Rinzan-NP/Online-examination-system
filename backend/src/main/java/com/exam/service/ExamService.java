package com.exam.service;

import com.exam.dto.CreateExamRequest;
import com.exam.dto.ExamSummaryDto;
import com.exam.dto.QuestionDto;
import com.exam.model.exam.Exam;
import com.exam.model.exam.ExamStatus;
import com.exam.model.question.Question;

import java.util.List;
import java.util.Optional;

public interface ExamService {

    Exam createExam(CreateExamRequest request);

    Optional<Exam> getExamById(String id);

    List<ExamSummaryDto> getAllExamSummaries();

    List<ExamSummaryDto> getExamsByStatus(ExamStatus status);

    List<ExamSummaryDto> getExamsBySubject(String subject);

    Exam updateExam(String id, CreateExamRequest request);

    boolean deleteExam(String id);

    Question addQuestionToExam(String examId, QuestionDto questionDto);

    Question convertDtoToQuestion(QuestionDto dto);

    ExamSummaryDto mapToSummaryDto(Exam exam);
}
