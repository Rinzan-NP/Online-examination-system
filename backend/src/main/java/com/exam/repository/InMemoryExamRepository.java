package com.exam.repository;

import com.exam.model.exam.Exam;
import com.exam.model.exam.ExamStatus;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Thread-safe In-Memory implementation of ExamRepository.
 */
@Repository
public class InMemoryExamRepository implements ExamRepository {

    private final Map<String, Exam> examStorage = new ConcurrentHashMap<>();

    @Override
    public Exam save(Exam exam) {
        if (exam != null && exam.getId() != null) {
            examStorage.put(exam.getId(), exam);
        }
        return exam;
    }

    @Override
    public Optional<Exam> findById(String id) {
        if (id == null) return Optional.empty();
        return Optional.ofNullable(examStorage.get(id));
    }

    @Override
    public List<Exam> findAll() {
        return new ArrayList<>(examStorage.values());
    }

    @Override
    public List<Exam> findByStatus(ExamStatus status) {
        if (status == null) return findAll();
        return examStorage.values().stream()
                .filter(e -> status.equals(e.getStatus()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Exam> findBySubject(String subject) {
        if (subject == null) return findAll();
        return examStorage.values().stream()
                .filter(e -> subject.equalsIgnoreCase(e.getSubject()))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(String id) {
        if (id != null) {
            examStorage.remove(id);
        }
    }
}
