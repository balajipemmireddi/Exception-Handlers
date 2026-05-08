package com.hotel.mapper;

import com.hotel.dto.HotelDetailDTO;
import com.hotel.dto.HotelSummaryDTO;
import com.hotel.dto.RoomDTO;
import com.hotel.entity.Hotel;
import com.hotel.entity.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for Hotel entity to DTOs conversion.
 * Separates mapping logic from service layer.
 */
@Component
public class HotelMapper {

    @Autowired
    private RoomMapper roomMapper;

    /**
     * Map Hotel entity to HotelSummaryDTO.
     * Calculates startingPrice from cheapest available room.
     */
    public HotelSummaryDTO toSummaryDTO(Hotel hotel) {
        if (hotel == null) {
            return null;
        }

        HotelSummaryDTO dto = new HotelSummaryDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setLocation(hotel.getLocation());
        dto.setImageUrl(hotel.getImageUrl());
        dto.setStarRating(hotel.getStarRating());

        // Calculate starting price from cheapest available room
        if (hotel.getRooms() != null && !hotel.getRooms().isEmpty()) {
            Double startingPrice = hotel.getRooms().stream()
                    .filter(Room::getAvailable)
                    .mapToDouble(Room::getPrice)
                    .min()
                    .orElse(0.0);
            dto.setStartingPrice(startingPrice == 0.0 ? null : startingPrice);
        } else {
            dto.setStartingPrice(null);
        }

        return dto;
    }

    /**
     * Map Hotel entity to HotelDetailDTO.
     */
    public HotelDetailDTO toDetailDTO(Hotel hotel) {
        if (hotel == null) {
            return null;
        }

        HotelDetailDTO dto = new HotelDetailDTO();
        dto.setId(hotel.getId());
        dto.setName(hotel.getName());
        dto.setLocation(hotel.getLocation());
        dto.setDescription(hotel.getDescription());
        dto.setImageUrl(hotel.getImageUrl());
        dto.setStarRating(hotel.getStarRating());

        // Map rooms to RoomDTOs
        if (hotel.getRooms() != null) {
            List<RoomDTO> roomDTOs = hotel.getRooms().stream()
                    .map(roomMapper::toDTO)
                    .collect(Collectors.toList());
            dto.setRooms(roomDTOs);
        }

        return dto;
    }

    /**
     * Map list of Hotel entities to HotelSummaryDTOs.
     */
    public List<HotelSummaryDTO> toSummaryDTOs(List<Hotel> hotels) {
        if (hotels == null) {
            return null;
        }
        return hotels.stream()
                .map(this::toSummaryDTO)
                .collect(Collectors.toList());
    }

    /**
     * Map list of Hotel entities to HotelDetailDTOs.
     */
    public List<HotelDetailDTO> toDetailDTOs(List<Hotel> hotels) {
        if (hotels == null) {
            return null;
        }
        return hotels.stream()
                .map(this::toDetailDTO)
                .collect(Collectors.toList());
    }
}