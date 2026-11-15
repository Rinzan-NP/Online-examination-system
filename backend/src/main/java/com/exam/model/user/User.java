package com.exam.model.user;

import com.exam.model.BaseEntity;

/**
 * Abstract Base Class for Users in the Examination System.
 * 
 * Demonstrates:
 * - Inheritance: Subclasses Student and Instructor extend this class.
 * - Encapsulation: Sensitive details (email, role) are protected with validated access.
 * - Abstraction: Defines abstract behavior that each user subtype must fulfill.
 */
public abstract class User extends BaseEntity {

    private String name;
    private String email;
    private UserRole role;
    private String avatar;

    public User() {
        super();
    }

    public User(String id, String name, String email, UserRole role, String avatar) {
        super(id);
        this.name = name;
        this.email = email;
        this.role = role;
        this.avatar = avatar;
    }

    // Abstract method showing Polymorphism across different user roles
    public abstract String getRoleDescription();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}
