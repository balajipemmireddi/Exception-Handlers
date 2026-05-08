package com.hotel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Phase 8: Room Request DTO
 * Used for adding/updating rooms to a hotel (ADMIN operations).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequestDTO {
    private String roomType;
    private Double price;
    private Integer capacity;
    private Boolean available;
}
