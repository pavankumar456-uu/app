package com.app.Hospital.Management.System.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.Hospital.Management.System.SecurityConfig.JwtUtil;
import com.app.Hospital.Management.System.SecurityConfig.SecurityConfigPatient;
import com.app.Hospital.Management.System.entities.User;
import com.app.Hospital.Management.System.repositories.UserRepository;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import java.util.Map;

@Validated
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private SecurityConfigPatient userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    // Register endpoint
    @Transactional
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        // Check if the email already exists
        if (userRepo.existsByEmail(user.getEmail())) {
            return new ResponseEntity<>("Duplicate entry for the field email", HttpStatus.BAD_REQUEST);
        }

        // Determine the role based on the email domain
        String role = user.getEmail().contains("@doctor.com") ? "ROLE_DOCTOR" : "ROLE_PATIENT";
        user.setRole(role);

        // Encode the password and save the user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        // Generate JWT token
        String jwtToken = jwtUtil.generateToken(userDetails);

        // Return a JSON response with the token and role (including "Bearer ")
        return ResponseEntity.ok(Map.of(
                "message", "Registered successfully",
                "role", role,
                "token", jwtToken
        ));
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody User user) {
        // Authenticate the user
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Invalid credentials"), HttpStatus.UNAUTHORIZED);
        }

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        // Generate JWT token
        String jwtToken = jwtUtil.generateToken(userDetails);

        // Retrieve the role from the database
        User existingUser = userRepo.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String role = existingUser.getRole();

        // Return a JSON response with the token and role (including "Bearer ")
        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "role", role,
                "token", jwtToken
        ));
    }
}