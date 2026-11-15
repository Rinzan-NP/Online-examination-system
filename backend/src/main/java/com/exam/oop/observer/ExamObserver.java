package com.exam.oop.observer;

/**
 * Observer Design Pattern: Observer Interface.
 * 
 * Demonstrates:
 * - Loose Coupling: Observers subscribe to exam events without tight coupling to business services.
 */
public interface ExamObserver {

    void onExamEvent(ExamEvent event);

    String getObserverName();
}
