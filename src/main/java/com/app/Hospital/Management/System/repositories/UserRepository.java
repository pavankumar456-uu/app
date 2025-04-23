package com.app.Hospital.Management.System.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.app.Hospital.Management.System.entities.User;

public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email); // Updated to return Optional<User>
}