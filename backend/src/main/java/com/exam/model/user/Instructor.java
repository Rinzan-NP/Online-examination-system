package com.exam.model.user;

/**
 * Concrete Instructor / Examiner entity.
 * 
 * Demonstrates:
 * - Inheritance: Extends User.
 * - Polymorphism: Overrides getRoleDescription().
 * - Encapsulation: Instructor-specific state (department, designation, employeeCode).
 */
public class Instructor extends User {

    private String department;
    private String designation;
    private String employeeCode;

    public Instructor() {
        super();
        setRole(UserRole.INSTRUCTOR);
    }

    public Instructor(String id, String name, String email, String avatar, String department, String designation, String employeeCode) {
        super(id, name, email, UserRole.INSTRUCTOR, avatar);
        this.department = department;
        this.designation = designation;
        this.employeeCode = employeeCode;
    }

    @Override
    public String getRoleDescription() {
        return designation + " in Department of " + department + " (Faculty ID: " + employeeCode + ")";
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }
}
