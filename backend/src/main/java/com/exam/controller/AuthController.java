package com.exam.controller;

import com.exam.dto.LoginRequest;
import com.exam.model.user.Instructor;
import com.exam.model.user.Student;
import com.exam.model.user.User;
import com.exam.model.user.UserRole;
import com.exam.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private User currentUser;

    public AuthController(UserService userService) {
        this.userService = userService;
        // Default active user is the mock student
        this.currentUser = userService.getMockStudent();
    }

    @GetMapping("/current-user")
    public ResponseEntity<User> getCurrentUser() {
        if (currentUser == null) {
            currentUser = userService.getMockStudent();
        }
        return ResponseEntity.ok(currentUser);
    }

    @PostMapping("/switch-role")
    public ResponseEntity<User> switchRole(@RequestParam UserRole role) {
        if (role == UserRole.INSTRUCTOR) {
            currentUser = userService.getMockInstructor();
        } else {
            currentUser = userService.getMockStudent();
        }
        return ResponseEntity.ok(currentUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        if (request.getRole() == UserRole.INSTRUCTOR || 
            (request.getEmail() != null && (request.getEmail().contains("mitchell") || request.getEmail().contains("turing") || request.getEmail().contains("faculty") || request.getEmail().contains("teacher") || request.getEmail().contains("sarah")))) {
            currentUser = userService.getMockInstructor();
        } else {
            currentUser = userService.getMockStudent();
        }
        return ResponseEntity.ok(currentUser);
    }

    @PostMapping("/teacher-login")
    public ResponseEntity<?> teacherLogin(@RequestBody LoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String password = request.getPassword() != null ? request.getPassword().trim() : "";

        // Direct support for teach@aisat.com with password 1-8 or 12345678
        if ("teach@aisat.com".equalsIgnoreCase(email)) {
            if (!password.isEmpty() && !password.equals("1-8") && !password.equals("12345678") && !password.equals("1 to 8")) {
                return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                        .body("Invalid password. Please enter 1-8 or 12345678.");
            }
            User user = userService.getUserByEmail("teach@aisat.com").orElse(null);
            if (user == null) {
                user = new Instructor("INST-003", "AISAT Faculty", "teach@aisat.com",
                        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
                        "Computer Science & Engineering", "Faculty Professor", "AISAT-FAC-01");
                userService.registerOrUpdate(user);
            }
            currentUser = user;
            return ResponseEntity.ok(currentUser);
        }

        // Other instructors lookup
        if (!email.isEmpty()) {
            User user = userService.getUserByEmail(email).orElse(null);
            if (user instanceof Instructor) {
                currentUser = user;
                return ResponseEntity.ok(currentUser);
            }
        }
        currentUser = userService.getMockInstructor();
        return ResponseEntity.ok(currentUser);
    }

    @PostMapping("/logout")
    public ResponseEntity<User> logout() {
        currentUser = userService.getMockStudent();
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
