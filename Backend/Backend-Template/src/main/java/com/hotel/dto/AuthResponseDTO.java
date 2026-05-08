package com.hotel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Phase 4: Auth Response DTO
 * Returned after both login AND register.
 * Contains JWT token, userId, name, and highest role.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private Long userId;
    private String name;
    private String role;  // Highest role: "USER" | "ADMIN" | "SUPER_ADMIN"
}
