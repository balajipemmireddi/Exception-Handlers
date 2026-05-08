package com.hotel.service;

import com.hotel.dto.RoomDTO;
import com.hotel.dto.RoomRequestDTO;
import com.hotel.entity.Hotel;
import com.hotel.entity.Room;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Phase 8: Room Service
 * Business logic for room management operations.
 */
@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private HotelRepository hotelRepository;

    /**
     * Add a room to a hotel (ADMIN operation).
     */
    @Transactional
    public RoomDTO addRoomToHotel(Long hotelId, RoomRequestDTO request) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));

        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setCapacity(request.getCapacity());
        room.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);

        Room savedRoom = roomRepository.save(room);
        return mapToDTO(savedRoom);
    }

    /**
     * Update a room (ADMIN operation).
     */
    @Transactional
    public RoomDTO updateRoom(Long roomId, RoomRequestDTO request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        if (request.getRoomType() != null) {
            room.setRoomType(request.getRoomType());
        }
        if (request.getPrice() != null) {
            room.setPrice(request.getPrice());
        }
        if (request.getCapacity() != null) {
            room.setCapacity(request.getCapacity());
        }
        if (request.getAvailable() != null) {
            room.setAvailable(request.getAvailable());
        }

        Room updatedRoom = roomRepository.save(room);
        return mapToDTO(updatedRoom);
    }

    /**
     * Delete a room (ADMIN operation).
     */
    @Transactional
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));
        roomRepository.delete(room);
    }

    /**
     * Get all rooms for a hotel.
     */
    public List<RoomDTO> getRoomsByHotelId(Long hotelId) {
        List<Room> rooms = roomRepository.findByHotelId(hotelId);
        return rooms.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Map Room entity to RoomDTO.
     */
    private RoomDTO mapToDTO(Room room) {
        return new RoomDTO(
                room.getId(),
                room.getRoomType(),
                room.getPrice(),
                room.getCapacity(),
                room.getAvailable()
        );
    }
}
