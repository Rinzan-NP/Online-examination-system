package com.exam.service;

import com.exam.dto.LeaderboardEntryDto;
import com.exam.dto.SubmitExamRequest;
import com.exam.model.submission.ExamSubmission;

import java.util.List;
import java.util.Optional;

public interface SubmissionService {

    ExamSubmission startAttempt(String examId, String studentId);

    ExamSubmission startAttempt(String examId, String studentId, String studentName, String studentRollNo);

    ExamSubmission submitAndEvaluate(String examId, SubmitExamRequest request);

    Optional<ExamSubmission> getSubmissionById(String submissionId);

    List<ExamSubmission> getSubmissionsByStudent(String studentId);

    List<ExamSubmission> getSubmissionsByExam(String examId);

    List<LeaderboardEntryDto> getExamLeaderboard(String examId);
}
