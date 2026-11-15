package com.exam.repository;

import com.exam.model.submission.ExamSubmission;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Thread-safe In-Memory implementation of SubmissionRepository.
 */
@Repository
public class InMemorySubmissionRepository implements SubmissionRepository {

    private final Map<String, ExamSubmission> submissionStorage = new ConcurrentHashMap<>();

    @Override
    public ExamSubmission save(ExamSubmission submission) {
        if (submission != null && submission.getId() != null) {
            submissionStorage.put(submission.getId(), submission);
        }
        return submission;
    }

    @Override
    public Optional<ExamSubmission> findById(String id) {
        if (id == null) return Optional.empty();
        return Optional.ofNullable(submissionStorage.get(id));
    }

    @Override
    public List<ExamSubmission> findByExamId(String examId) {
        if (examId == null) return new ArrayList<>();
        return submissionStorage.values().stream()
                .filter(s -> examId.equals(s.getExamId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExamSubmission> findByStudentId(String studentId) {
        if (studentId == null) return new ArrayList<>();
        return submissionStorage.values().stream()
                .filter(s -> studentId.equals(s.getStudentId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExamSubmission> findAll() {
        return new ArrayList<>(submissionStorage.values());
    }
}
