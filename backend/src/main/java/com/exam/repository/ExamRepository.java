package com.exam.repository;

import com.exam.model.exam.Exam;
import com.exam.model.exam.ExamStatus;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Exam persistence.
 */
public interface ExamRepository {

    Exam save(Exam exam);

    Optional<Exam> findById(String id);

    List<Exam> findAll();

    List<Exam> findByStatus(ExamStatus status);

    List<Exam> findBySubject(String subject);

    void deleteById(String id);
}
