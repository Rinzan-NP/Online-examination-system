package com.exam.model.user;

/**
 * Concrete Student entity representing test candidates.
 * 
 * Demonstrates:
 * - Inheritance: Extends User.
 * - Polymorphism: Overrides getRoleDescription().
 * - Encapsulation: Student-specific attributes like rollNumber and branch.
 */
public class Student extends User {

    private String rollNumber;
    private String branch;
    private int semester;
    private double cumulativeGpa;

    public Student() {
        super();
        setRole(UserRole.STUDENT);
    }

    public Student(String id, String name, String email, String avatar, String rollNumber, String branch, int semester) {
        super(id, name, email, UserRole.STUDENT, avatar);
        this.rollNumber = rollNumber;
        this.branch = branch;
        this.semester = semester;
        this.cumulativeGpa = 0.0;
    }

    @Override
    public String getRoleDescription() {
        return "Student Candidate enrolled in " + branch + " (Semester " + semester + ", Roll: " + rollNumber + ")";
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public double getCumulativeGpa() {
        return cumulativeGpa;
    }

    public void setCumulativeGpa(double cumulativeGpa) {
        this.cumulativeGpa = cumulativeGpa;
    }
}
