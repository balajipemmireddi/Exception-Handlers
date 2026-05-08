package com.hotel.mapper;

import com.hotel.dto.BookingResponseDTO;
import com.hotel.entity.Booking;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for Booking entity to DTOs conversion.
 * Separates mapping logic from service layer.
 */
@Component
public class BookingMapper {

    /**
     * Map Booking entity to BookingResponseDTO.
     */
    public BookingResponseDTO toResponseDTO(Booking booking) {
        if (booking == null) {
            return null;
        }

        return new BookingResponseDTO(
                booking.getId(),
                booking.getUser().getId(),
                booking.getUser().getName(),
                booking.getHotel().getName(),
                booking.getRoom().getRoomType(),
                booking.getCheckIn().toString(),
                booking.getCheckOut().toString(),
                booking.getStatus(),
                booking.getTotalAmount(),
                booking.getCreatedAt().toString()
        );
    }

    /**
     * Map list of Booking entities to BookingResponseDTOs.
     */
    public List<BookingResponseDTO> toResponseDTOs(List<Booking> bookings) {
        if (bookings == null) {
            return null;
        }
        return bookings.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}