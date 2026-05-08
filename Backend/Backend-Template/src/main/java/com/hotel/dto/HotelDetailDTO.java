package com.hotel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

/**
 * Phase 6: Hotel Detail DTO
 * Used for hotel creation/update response and hotel detail view.
 * Includes full hotel information with associated rooms.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelDetailDTO {
    private Long id;
    private String name;
    private String location;
    private String description;
    private String imageUrl;
    private Integer starRating;
    private List<RoomDTO> rooms;
}
