package com.hotel.dto;

/**
 * Phase 10: Booking Update DTO
 * Used by ADMIN to update existing bookings.
 * All fields are optional.
 */
public class BookingUpdateDTO {
    
    private String checkIn;    // "YYYY-MM-DD" - optional
    private String checkOut;   // "YYYY-MM-DD" - optional
    private String status;     // "CONFIRMED" | "CANCELLED" - optional

    // Constructors
    public BookingUpdateDTO() {
    }

    public BookingUpdateDTO(String checkIn, String checkOut, String status) {
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status;
    }

    // Getters and Setters
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}