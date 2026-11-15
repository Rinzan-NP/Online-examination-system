package com.exam.controller;

import com.exam.dto.CreateExamRequest;
import com.exam.dto.ExamSummaryDto;
import com.exam.dto.QuestionDto;
import com.exam.model.exam.Exam;
import com.exam.model.exam.ExamStatus;
import com.exam.model.question.Question;
import com.exam.service.ExamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping
    public ResponseEntity<List<ExamSummaryDto>> getExams(
            @RequestParam(required = false) ExamStatus status,
            @RequestParam(required = false) String subject) {
        if (status != null) {
            return ResponseEntity.ok(examService.getExamsByStatus(status));
        }
        if (subject != null && !subject.trim().isEmpty()) {
            return ResponseEntity.ok(examService.getExamsBySubject(subject));
        }
        return ResponseEntity.ok(examService.getAllExamSummaries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable String id) {
        return examService.getExamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Exam> createExam(@RequestBody CreateExamRequest request) {
        Exam created = examService.createExam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable String id, @RequestBody CreateExamRequest request) {
        try {
            Exam updated = examService.updateExam(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable String id) {
        boolean deleted = examService.deleteExam(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/questions")
    public ResponseEntity<Question> addQuestion(@PathVariable String id, @RequestBody QuestionDto questionDto) {
        try {
            Question question = examService.addQuestionToExam(id, questionDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(question);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
