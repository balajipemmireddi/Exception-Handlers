package com.hotel.service;

import com.hotel.dto.AuthResponseDTO;
import com.hotel.entity.Role;
import com.hotel.entity.Role.RoleName;
import com.hotel.entity.Users;
import com.hotel.repository.RoleRepository;
import com.hotel.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;

@Service
public class UserService {

    @Autowired
    private AuthenticationManager authmanager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepository roleRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    /**
     * Resolves the highest role a user holds.
     * Priority: SUPER_ADMIN > ADMIN > USER
     */
    public String resolveHighestRole(Users user) {
        return user.getRoles().stream()
                .map(r -> r.getName().name())
                .max(Comparator.comparingInt(this::roleWeight))
                .orElse(RoleName.USER.name());
    }

    private int roleWeight(String roleName) {
        return switch (roleName) {
            case "SUPER_ADMIN" -> 3;
            case "ADMIN"       -> 2;
            default            -> 1;
        };
    }

    /**
     * Phase 4: Login method that returns AuthResponseDTO.
     * Authenticates user and generates JWT token with userId and role.
     */
    public AuthResponseDTO login(String email, String password) {
        // Authenticate
        Authentication authentication = authmanager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        if (!authentication.isAuthenticated()) {
            throw new RuntimeException("Authentication failed");
        }

        // Fetch user from DB
        Users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Resolve highest role
        String highestRole = resolveHighestRole(user);

        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail(), user.getId(), highestRole);

        // Return AuthResponseDTO
        return new AuthResponseDTO(token, user.getId(), user.getName(), highestRole);
    }

    /**
     * Phase 4: Generate JWT token (wrapper for JWTService).
     */
    public String generateToken(String email, Long userId, String role) {
        return jwtService.generateToken(email, userId, role);
    }

    /** 
     * Legacy verify method — returns JWT token string.
     * Kept for backward compatibility with old controllers.
     */
    public String verify(Users user) {
        Authentication authentication = authmanager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        if (authentication.isAuthenticated()) {
            Users realUser = userRepo.findByEmail(user.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String highestRole = resolveHighestRole(realUser);
            return jwtService.generateToken(realUser.getEmail(), realUser.getId(), highestRole);
        }
        return "Fail";
    }

    /** Register — assigns default USER role, hashes password, persists. */
    public Users register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());

        // Assign default USER role from the roles table
        Role userRole = roleRepository.findByName(RoleName.USER)
                .orElseThrow(() -> new RuntimeException("Default USER role not found in database. Run data.sql seed first."));
        user.getRoles().add(userRole);

        return userRepo.save(user);
    }

    public Users getById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}
