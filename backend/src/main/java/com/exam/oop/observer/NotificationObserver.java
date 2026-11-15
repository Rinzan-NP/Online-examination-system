package com.exam.oop.observer;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Concrete Observer: Dispatches simulated notifications to students and instructors.
 */
@Component
public class NotificationObserver implements ExamObserver {

    private final List<String> notificationLog = new CopyOnWriteArrayList<>();

    @Override
    public void onExamEvent(ExamEvent event) {
        String message;
        switch (event.getEventType()) {
            case EXAM_CREATED:
                message = "New Exam Published: '" + event.getExamTitle() + "' is now ready for students.";
                break;
            case EXAM_STARTED:
                message = "Candidate " + event.getStudentName() + " has begun Exam: '" + event.getExamTitle() + "'.";
                break;
            case EXAM_SUBMITTED:
                message = "Candidate " + event.getStudentName() + " submitted answers for Exam: '" + event.getExamTitle() + "'.";
                break;
            case EXAM_GRADED:
                message = "Result Available: Candidate " + event.getStudentName() + " scored " + event.getScore() + " in '" + event.getExamTitle() + "'.";
                break;
            default:
                message = "System notification for Exam: " + event.getExamTitle();
        }
        notificationLog.add(0, message);
        System.out.println("[NotificationObserver] " + message);
    }

    @Override
    public String getObserverName() {
        return "RealTimeNotificationService";
    }

    public List<String> getRecentNotifications() {
        return new ArrayList<>(notificationLog);
    }
}
