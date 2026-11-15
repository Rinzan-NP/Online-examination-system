package com.exam.repository;

import com.exam.model.submission.ExamSubmission;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Exam Submissions persistence.
 */
public interface SubmissionRepository {

    ExamSubmission save(ExamSubmission submission);

    Optional<ExamSubmission> findById(String id);

    List<ExamSubmission> findByExamId(String examId);

    List<ExamSubmission> findByStudentId(String studentId);

    List<ExamSubmission> findAll();
}
