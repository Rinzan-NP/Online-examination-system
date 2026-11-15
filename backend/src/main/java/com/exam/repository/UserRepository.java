package com.exam.repository;

import com.exam.model.user.User;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User persistence.
 * Demonstrates Abstraction and Dependency Inversion Principle.
 */
public interface UserRepository {

    User save(User user);

    Optional<User> findById(String id);

    Optional<User> findByEmail(String email);

    List<User> findAll();

    void deleteById(String id);
}
