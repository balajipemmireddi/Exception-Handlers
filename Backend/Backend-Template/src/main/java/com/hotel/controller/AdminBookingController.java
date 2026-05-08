package com.hotel.controller;

import com.hotel.dto.BookingResponseDTO;
import com.hotel.dto.BookingUpdateDTO;
import com.hotel.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Phase 10: Admin Booking Controller
 * Handles ADMIN operations for viewing, updating, and deleting bookings.
 */
@RestController
@RequestMapping("/api/admin/bookings")
@CrossOrigin
public class AdminBookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * GET /api/admin/bookings
     * View ALL system-wide bookings (ADMIN).
     * Returns list of BookingResponseDTO.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        List<BookingResponseDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    /**
     * PUT /api/admin/bookings/{id}
     * Edit/update a booking (ADMIN).
     * Returns 200 with updated BookingResponseDTO.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<BookingResponseDTO> updateBooking(
            @PathVariable Long id,
            @RequestBody BookingUpdateDTO request) {
        BookingResponseDTO booking = bookingService.updateBooking(id, request);
        return ResponseEntity.ok(booking);
    }

    /**
     * DELETE /api/admin/bookings/{id}
     * Hard delete a booking (ADMIN).
     * Returns 200 with success message.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Booking deleted successfully");
        return ResponseEntity.ok(response);
    }
}