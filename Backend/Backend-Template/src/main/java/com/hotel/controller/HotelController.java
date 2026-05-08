package com.hotel.controller;

import com.hotel.dto.HotelDetailDTO;
import com.hotel.dto.HotelRequestDTO;
import com.hotel.dto.HotelSummaryDTO;
import com.hotel.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Phase 6 & 7: Hotel Controller
 * Handles ADMIN operations for hotel management and PUBLIC operations for hotel viewing.
 */
@RestController
@RequestMapping("/api/hotels")
@CrossOrigin
public class HotelController {

    @Autowired
    private HotelService hotelService;

    // ========== PUBLIC ENDPOINTS (Phase 7) ==========

    /**
     * GET /api/hotels
     * Get all hotels (PUBLIC).
     * Returns list of HotelSummaryDTO with startingPrice.
     */
    @GetMapping
    public ResponseEntity<List<HotelSummaryDTO>> getAllHotels() {
        List<HotelSummaryDTO> hotels = hotelService.getAllHotels();
        return ResponseEntity.ok(hotels);
    }

    /**
     * GET /api/hotels/{id}
     * Get hotel detail with rooms (PUBLIC).
     * Returns HotelDetailDTO.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HotelDetailDTO> getHotelById(@PathVariable Long id) {
        HotelDetailDTO hotel = hotelService.getHotelById(id);
        return ResponseEntity.ok(hotel);
    }

    /**
     * GET /api/hotels/search?location=&checkIn=&checkOut=
     * Search hotels by location (PUBLIC).
     * Optional checkIn/checkOut for future availability filtering.
     */
    @GetMapping("/search")
    public ResponseEntity<List<HotelSummaryDTO>> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String checkIn,
            @RequestParam(required = false) String checkOut) {
        List<HotelSummaryDTO> hotels = hotelService.searchHotels(location, checkIn, checkOut);
        return ResponseEntity.ok(hotels);
    }

    // ========== ADMIN ENDPOINTS (Phase 6) ==========

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
