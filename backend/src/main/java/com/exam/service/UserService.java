package com.exam.service;

import com.exam.model.user.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User registerOrUpdate(User user);

    Optional<User> getUserById(String id);

    Optional<User> getUserByEmail(String email);

    List<User> getAllUsers();

    User getMockStudent();

    User getMockInstructor();
}
