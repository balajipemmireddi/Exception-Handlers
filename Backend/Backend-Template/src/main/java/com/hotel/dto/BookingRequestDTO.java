package com.hotel.dto;

/**
 * Phase 9: Booking Request DTO
 * Used for creating a new booking.
 */
public class BookingRequestDTO {
    
    private Long hotelId;
    private Long roomId;
    private String checkIn;    // "YYYY-MM-DD"
    private String checkOut;   // "YYYY-MM-DD"

    // Constructors
    public BookingRequestDTO() {
    }

    public BookingRequestDTO(Long hotelId, Long roomId, String checkIn, String checkOut) {
        this.hotelId = hotelId;
        this.roomId = roomId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
    }

    // Getters and Setters
    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getCheckIn() {
        return checkIn;
    }

    public void setCheckIn(String checkIn) {
        this.checkIn = checkIn;
    }

    public String getCheckOut() {
        return checkOut;
    }

    public void setCheckOut(String checkOut) {
        this.checkOut = checkOut;
    }
}
