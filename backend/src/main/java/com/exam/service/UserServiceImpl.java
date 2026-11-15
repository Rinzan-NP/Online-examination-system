package com.exam.service;

import com.exam.model.user.Instructor;
import com.exam.model.user.Student;
import com.exam.model.user.User;
import com.exam.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerOrUpdate(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getMockStudent() {
        return userRepository.findById("STUDENT-001")
                .orElseGet(() -> {
                    Student student = new Student("STUDENT-001", "Alex Mercer", "alex.mercer@college.edu", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", "CS2024-042", "Computer Science & Engineering", 4);
                    return userRepository.save(student);
                });
    }

    @Override
    public User getMockInstructor() {
        return userRepository.findById("INST-001")
                .orElseGet(() -> {
                    Instructor instructor = new Instructor("INST-001", "Dr. Sarah Mitchell", "sarah.mitchell@college.edu", "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150", "Computer Science", "Associate Professor", "FAC-9021");
                    return userRepository.save(instructor);
                });
    }
}
