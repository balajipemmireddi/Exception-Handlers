package com.hotel.service;

import com.hotel.dto.HotelDetailDTO;
import com.hotel.dto.HotelRequestDTO;
import com.hotel.dto.HotelSummaryDTO;
import com.hotel.entity.Hotel;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.mapper.HotelMapper;
import com.hotel.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Phase 6 & 7: Hotel Service
 * Business logic for hotel management operations (ADMIN) and public hotel viewing.
 * Updated to use HotelMapper for entity-DTO conversion.
 */
@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private HotelMapper hotelMapper;

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
        return hotelMapper.toDetailDTO(savedHotel);
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
        return hotelMapper.toDetailDTO(updatedHotel);
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
     * Phase 7: Get all hotels (PUBLIC).
     * Returns list of HotelSummaryDTO with startingPrice.
     */
    public List<HotelSummaryDTO> getAllHotels() {
        List<Hotel> hotels = hotelRepository.findAll();
        return hotelMapper.toSummaryDTOs(hotels);
    }

    /**
     * Phase 7: Get hotel by ID (PUBLIC).
     * Returns HotelDetailDTO with rooms.
     */
    public HotelDetailDTO getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
        return hotelMapper.toDetailDTO(hotel);
    }

    /**
     * Phase 7: Search hotels by location (PUBLIC).
     * Optional checkIn/checkOut parameters for future availability filtering.
     */
    public List<HotelSummaryDTO> searchHotels(String location, String checkIn, String checkOut) {
        List<Hotel> hotels;
        
        if (location != null && !location.isEmpty()) {
            hotels = hotelRepository.findByLocationContainingIgnoreCase(location);
        } else {
            hotels = hotelRepository.findAll();
        }
        
        // TODO Phase 8+: Filter by room availability based on checkIn/checkOut dates
        
        return hotelMapper.toSummaryDTOs(hotels);
    }
}
