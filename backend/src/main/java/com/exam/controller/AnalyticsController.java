package com.exam.controller;

import com.exam.model.submission.ExamSubmission;
import com.exam.oop.observer.AnalyticsObserver;
import com.exam.oop.observer.NotificationObserver;
import com.exam.repository.ExamRepository;
import com.exam.repository.SubmissionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final ExamRepository examRepository;
    private final SubmissionRepository submissionRepository;
    private final AnalyticsObserver analyticsObserver;
    private final NotificationObserver notificationObserver;

    public AnalyticsController(ExamRepository examRepository,
                               SubmissionRepository submissionRepository,
                               AnalyticsObserver analyticsObserver,
                               NotificationObserver notificationObserver) {
        this.examRepository = examRepository;
        this.submissionRepository = submissionRepository;
        this.analyticsObserver = analyticsObserver;
        this.notificationObserver = notificationObserver;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        Map<String, Object> data = new HashMap<>();
        int totalExams = examRepository.findAll().size();
        List<ExamSubmission> submissions = submissionRepository.findAll();
        int totalSubs = submissions.size();

        double avgScore = 0.0;
        long passedCount = 0;
        if (totalSubs > 0) {
            double totalPct = 0.0;
            for (ExamSubmission s : submissions) {
                totalPct += s.getPercentage();
                if (s.isPassed()) passedCount++;
            }
            avgScore = Math.round((totalPct / totalSubs) * 10.0) / 10.0;
        }

        double passRate = totalSubs > 0 ? Math.round(((double) passedCount / totalSubs * 100.0) * 10.0) / 10.0 : 0.0;

        data.put("totalExams", totalExams);
        data.put("totalSubmissions", totalSubs);
        data.put("averageScorePercentage", avgScore);
        data.put("overallPassRate", passRate);
        data.put("recentNotifications", notificationObserver.getRecentNotifications());
        data.put("totalExamsCreatedMetric", analyticsObserver.getTotalExamsCreated());

        return ResponseEntity.ok(data);
    }
}
