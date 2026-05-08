package com.hotel.mapper;

import com.hotel.dto.RoomDTO;
import com.hotel.entity.Room;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for Room entity to DTOs conversion.
 * Separates mapping logic from service layer.
 */
@Component
public class RoomMapper {

    /**
     * Map Room entity to RoomDTO.
     */
    public RoomDTO toDTO(Room room) {
        if (room == null) {
            return null;
        }

        return new RoomDTO(
                room.getId(),
                room.getRoomType(),
                room.getPrice(),
                room.getCapacity(),
                room.getAvailable()
        );
    }

    /**
     * Map list of Room entities to RoomDTOs.
     */
    public List<RoomDTO> toDTOs(List<Room> rooms) {
        if (rooms == null) {
            return null;
        }
        return rooms.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}