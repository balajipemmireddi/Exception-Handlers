package com.hotel.controller;

import com.hotel.dto.HotelDetailDTO;
import com.hotel.dto.HotelRequestDTO;
import com.hotel.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Phase 6: Hotel Controller
 * Handles ADMIN operations for hotel management.
 * All endpoints require ADMIN or SUPER_ADMIN role.
 */
@RestController
@RequestMapping("/api/hotels")
@CrossOrigin
public class HotelController {

    @Autowired
    private HotelService hotelService;

    /**
     * POST /api/hotels
     * Create a new hotel (ADMIN only).
     * Returns 201 with HotelDetailDTO.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<HotelDetailDTO> createHotel(@RequestBody HotelRequestDTO request) {
        HotelDetailDTO hotel = hotelService.createHotel(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(hotel);
    }

    /**
     * PUT /api/hotels/{id}
     * Update an existing hotel (ADMIN only).
     * Returns 200 with updated HotelDetailDTO.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<HotelDetailDTO> updateHotel(
            @PathVariable Long id,
            @RequestBody HotelRequestDTO request) {
        HotelDetailDTO hotel = hotelService.updateHotel(id, request);
        return ResponseEntity.ok(hotel);
    }

    /**
     * DELETE /api/hotels/{id}
     * Delete a hotel (ADMIN only).
     * Returns 200 with success message.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hotel deleted successfully");
        return ResponseEntity.ok(response);
    }
}
