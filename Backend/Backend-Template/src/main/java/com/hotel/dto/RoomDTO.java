package com.hotel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Phase 6: Room DTO (skeleton for HotelDetailDTO)
 * Full implementation in Phase 8.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private Long id;
    private String roomType;
    private Double price;
    private Integer capacity;
    private Boolean available;
}
