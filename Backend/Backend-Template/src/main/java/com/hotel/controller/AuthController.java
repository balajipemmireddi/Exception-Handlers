package com.hotel.controller;

import com.hotel.dto.AuthResponseDTO;
import com.hotel.dto.LoginRequestDTO;
import com.hotel.dto.RegisterRequestDTO;
import com.hotel.entity.Users;
import com.hotel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Phase 4: Authentication Controller
 * Handles user registration and login.
 * Endpoints: POST /api/auth/register, POST /api/auth/login
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * POST /api/auth/register
     * Register a new user with default USER role.
     * Returns 201 with AuthResponseDTO containing JWT token.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterRequestDTO request) {
        // Create Users entity from DTO
        Users user = new Users();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        // Register user (assigns default USER role, hashes password)
        Users registeredUser = userService.register(user);

        // Generate JWT token
        String highestRole = userService.resolveHighestRole(registeredUser);
        String token = userService.generateToken(registeredUser.getEmail(), registeredUser.getId(), highestRole);

        // Build response
        AuthResponseDTO response = new AuthResponseDTO(
                token,
                registeredUser.getId(),
                registeredUser.getName(),
                highestRole
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * POST /api/auth/login
     * Authenticate user and return JWT token.
     * Returns 200 with AuthResponseDTO.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO request) {
        // Authenticate and get token
        AuthResponseDTO response = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }
}
