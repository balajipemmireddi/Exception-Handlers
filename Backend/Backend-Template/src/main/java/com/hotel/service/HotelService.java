package com.hotel.service;

import com.hotel.dto.HotelDetailDTO;
import com.hotel.dto.HotelRequestDTO;
import com.hotel.dto.RoomDTO;
import com.hotel.entity.Hotel;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

/**
 * Phase 6: Hotel Service
 * Business logic for hotel management operations.
 */
@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    /**
     * Create a new hotel (ADMIN operation).
     */
    @Transactional
    public HotelDetailDTO createHotel(HotelRequestDTO request) {
        Hotel hotel = new Hotel();
        hotel.setName(request.getName());
        hotel.setLocation(request.getLocation());
        hotel.setDescription(request.getDescription());
        hotel.setImageUrl(request.getImageUrl());
        hotel.setStarRating(request.getStarRating());

        Hotel savedHotel = hotelRepository.save(hotel);
        return mapToDetailDTO(savedHotel);
    }

    /**
     * Update an existing hotel (ADMIN operation).
     */
    @Transactional
    public HotelDetailDTO updateHotel(Long id, HotelRequestDTO request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));

        // Update only provided fields
        if (request.getName() != null) {
            hotel.setName(request.getName());
        }
        if (request.getLocation() != null) {
            hotel.setLocation(request.getLocation());
        }
        if (request.getDescription() != null) {
            hotel.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            hotel.setImageUrl(request.getImageUrl());
        }
        if (request.getStarRating() != null) {
            hotel.setStarRating(request.getStarRating());
        }

        Hotel updatedHotel = hotelRepository.save(hotel);
        return mapToDetailDTO(updatedHotel);
    }

    /**
     * Delete a hotel (ADMIN operation).
     */
    @Transactional
    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        hotelRepository.delete(hotel);
    }

    /**
     * Get hotel by ID.
     */
    public HotelDetailDTO getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        return mapToDetailDTO(hotel);
    }

    /**
     * Map Hotel entity to HotelDetailDTO.
     */
    private HotelDetailDTO mapToDetailDTO(Hotel hotel) {
        HotelDetailDTO dto = new HotelDetailDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setLocation(hotel.getLocation());
        dto.setDescription(hotel.getDescription());
        dto.setImageUrl(hotel.getImageUrl());
        dto.setStarRating(hotel.getStarRating());
        
        // Map rooms to RoomDTOs
        dto.setRooms(hotel.getRooms().stream()
                .map(room -> new RoomDTO(
                        room.getId(),
                        room.getRoomType(),
                        room.getPrice(),
                        room.getCapacity(),
                        room.getAvailable()
                ))
                .collect(Collectors.toList()));
        
        return dto;
    }
}
