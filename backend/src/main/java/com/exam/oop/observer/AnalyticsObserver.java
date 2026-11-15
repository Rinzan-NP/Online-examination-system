package com.exam.oop.observer;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Concrete Observer: Aggregates real-time metrics across exams.
 */
@Component
public class AnalyticsObserver implements ExamObserver {

    private final AtomicInteger totalExamsCreated = new AtomicInteger(0);
    private final AtomicInteger totalSubmissions = new AtomicInteger(0);
    private final Map<String, AtomicInteger> examSubmissionCounts = new ConcurrentHashMap<>();

    @Override
    public void onExamEvent(ExamEvent event) {
        if (event.getEventType() == ExamEvent.EventType.EXAM_CREATED) {
            totalExamsCreated.incrementAndGet();
        } else if (event.getEventType() == ExamEvent.EventType.EXAM_SUBMITTED) {
            totalSubmissions.incrementAndGet();
            if (event.getExamId() != null) {
                examSubmissionCounts.computeIfAbsent(event.getExamId(), k -> new AtomicInteger(0)).incrementAndGet();
            }
        }
        System.out.println("[AnalyticsObserver] Updated running metrics: Total Submissions=" + totalSubmissions.get());
    }

    @Override
    public String getObserverName() {
        return "RealTimeAnalyticsEngine";
    }

    public int getTotalExamsCreated() {
        return totalExamsCreated.get();
    }

    public int getTotalSubmissions() {
        return totalSubmissions.get();
    }

    public int getSubmissionsForExam(String examId) {
        AtomicInteger count = examSubmissionCounts.get(examId);
        return count != null ? count.get() : 0;
    }
}
