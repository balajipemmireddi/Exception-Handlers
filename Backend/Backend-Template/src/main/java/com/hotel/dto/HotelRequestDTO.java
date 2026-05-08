package com.hotel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Phase 6: Hotel Request DTO
 * Used for creating and updating hotels (ADMIN operations).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelRequestDTO {
    private String name;
    private String location;
    private String description;
    private String imageUrl;
    private Integer starRating;
}
