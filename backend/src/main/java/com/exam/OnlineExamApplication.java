package com.exam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for the Online Examination System Backend.
 * 
 * Demonstrates Enterprise Object-Oriented Software Architecture with:
 * - Encapsulation (Access modifiers, Domain Models)
 * - Inheritance (Class hierarchies for Users and Questions)
 * - Polymorphism (Dynamic dispatch evaluation and Strategy Pattern)
 * - Abstraction (Service Interfaces, Abstract Classes)
 * - Design Patterns (Factory, Strategy, Observer, Builder)
 */
@SpringBootApplication
public class OnlineExamApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnlineExamApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Online Examination System Backend is LIVE!      ");
        System.out.println(" REST API available at http://localhost:8080/api ");
        System.out.println("=================================================");
    }
}
