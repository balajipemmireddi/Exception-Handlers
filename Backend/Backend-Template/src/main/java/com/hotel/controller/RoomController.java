package com.hotel.controller;

import com.hotel.dto.RoomDTO;
import com.hotel.dto.RoomRequestDTO;
import com.hotel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Phase 8: Room Controller
 * Handles ADMIN operations for room management.
 * Endpoints for adding/updating/deleting rooms to hotels.
 */
@RestController
@RequestMapping("/api/hotels/{hotelId}/rooms")
@CrossOrigin
public class RoomController {

    @Autowired
    private RoomService roomService;

    /**
     * POST /api/hotels/{hotelId}/rooms
     * Add a room to a hotel (ADMIN only).
     * Returns 201 with RoomDTO.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<RoomDTO> addRoom(
            @PathVariable Long hotelId,
            @RequestBody RoomRequestDTO request) {
        RoomDTO room = roomService.addRoomToHotel(hotelId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    /**
     * GET /api/hotels/{hotelId}/rooms
     * Get all rooms for a hotel (PUBLIC).
     * Returns list of RoomDTO.
     */
    @GetMapping
    public ResponseEntity<List<RoomDTO>> getRoomsByHotel(@PathVariable Long hotelId) {
        List<RoomDTO> rooms = roomService.getRoomsByHotelId(hotelId);
        return ResponseEntity.ok(rooms);
    }

    /**
     * PUT /api/hotels/{hotelId}/rooms/{roomId}
     * Update a room (ADMIN only).
     * Returns 200 with updated RoomDTO.
     */
    @PutMapping("/{roomId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<RoomDTO> updateRoom(
            @PathVariable Long hotelId,
            @PathVariable Long roomId,
            @RequestBody RoomRequestDTO request) {
        RoomDTO room = roomService.updateRoom(roomId, request);
        return ResponseEntity.ok(room);
    }

    /**
     * DELETE /api/hotels/{hotelId}/rooms/{roomId}
     * Delete a room (ADMIN only).
     * Returns 200 with success message.
     */
    @DeleteMapping("/{roomId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> deleteRoom(
            @PathVariable Long hotelId,
            @PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room deleted successfully");
        return ResponseEntity.ok(response);
    }
}
