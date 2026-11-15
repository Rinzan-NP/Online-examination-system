package com.exam.repository;

import com.exam.model.user.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe In-Memory implementation of UserRepository.
 * Enables instantaneous out-of-the-box execution without external DB dependencies.
 */
@Repository
public class InMemoryUserRepository implements UserRepository {

    private final Map<String, User> userStorage = new ConcurrentHashMap<>();

    @Override
    public User save(User user) {
        if (user != null && user.getId() != null) {
            userStorage.put(user.getId(), user);
        }
        return user;
    }

    @Override
    public Optional<User> findById(String id) {
        if (id == null) return Optional.empty();
        return Optional.ofNullable(userStorage.get(id));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        if (email == null) return Optional.empty();
        return userStorage.values().stream()
                .filter(u -> email.equalsIgnoreCase(u.getEmail()))
                .findFirst();
    }

    @Override
    public List<User> findAll() {
        return new ArrayList<>(userStorage.values());
    }

    @Override
    public void deleteById(String id) {
        if (id != null) {
            userStorage.remove(id);
        }
    }
}
