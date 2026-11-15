package com.exam.controller;

import com.exam.dto.LeaderboardEntryDto;
import com.exam.dto.SubmitExamRequest;
import com.exam.model.submission.ExamSubmission;
import com.exam.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping("/exams/{examId}/start")
    public ResponseEntity<ExamSubmission> startExam(
            @PathVariable String examId,
            @RequestParam(required = false, defaultValue = "STUDENT-001") String studentId,
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) String studentRollNo) {
        try {
            ExamSubmission attempt = submissionService.startAttempt(examId, studentId, studentName, studentRollNo);
            return ResponseEntity.status(HttpStatus.CREATED).body(attempt);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/exams/{examId}/submit")
    public ResponseEntity<ExamSubmission> submitExam(
            @PathVariable String examId,
            @RequestBody SubmitExamRequest request) {
        try {
            ExamSubmission evaluated = submissionService.submitAndEvaluate(examId, request);
            return ResponseEntity.ok(evaluated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<ExamSubmission> getSubmissionById(@PathVariable String id) {
        return submissionService.getSubmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/submissions/student/{studentId}")
    public ResponseEntity<List<ExamSubmission>> getStudentSubmissions(@PathVariable String studentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByStudent(studentId));
    }

    @GetMapping("/exams/{examId}/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard(@PathVariable String examId) {
        return ResponseEntity.ok(submissionService.getExamLeaderboard(examId));
    }
}
