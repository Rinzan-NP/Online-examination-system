package com.exam.oop.observer;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Observer Design Pattern: Subject / Event Publisher.
 * 
 * Demonstrates:
 * - Subject maintaining a dynamic list of subscribers.
 * - Broadcasts notifications when state changes occur.
 */
@Component
public class ExamEventPublisher {

    private final List<ExamObserver> observers = new CopyOnWriteArrayList<>();

    public void registerObserver(ExamObserver observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
            System.out.println("[ExamEventPublisher] Registered observer: " + observer.getObserverName());
        }
    }

    public void removeObserver(ExamObserver observer) {
        observers.remove(observer);
    }

    public void publishEvent(ExamEvent event) {
        System.out.println("[ExamEventPublisher] Publishing event: " + event.getEventType() + " for Exam: " + event.getExamTitle());
        for (ExamObserver observer : observers) {
            try {
                observer.onExamEvent(event);
            } catch (Exception e) {
                System.err.println("Error notifying observer " + observer.getObserverName() + ": " + e.getMessage());
            }
        }
    }
}
