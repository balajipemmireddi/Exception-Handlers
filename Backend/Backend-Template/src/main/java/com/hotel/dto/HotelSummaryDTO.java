package com.hotel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Phase 7: Hotel Summary DTO
 * Used for hotel listing page.
 * Includes startingPrice calculated from cheapest available room.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelSummaryDTO {
    private Long id;
    private String name;
    private String location;
    private String imageUrl;
    private Integer starRating;
    private Double startingPrice;  // Minimum price from available rooms
}
