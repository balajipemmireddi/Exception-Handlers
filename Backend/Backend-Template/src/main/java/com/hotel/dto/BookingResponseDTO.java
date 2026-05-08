package com.hotel.dto;

/**
 * Phase 9: Booking Response DTO
 * Returned for all booking read operations.
 */
public class BookingResponseDTO {
    
    private Long id;
    private Long userId;
    private String userName;
    private String hotelName;
    private String roomType;
    private String checkIn;
    private String checkOut;
    private String status;
    private Double totalAmount;
    private String createdAt;

    // Constructors
    public BookingResponseDTO() {
    }

    public BookingResponseDTO(Long id, Long userId, String userName, String hotelName, 
                             String roomType, String checkIn, String checkOut, 
                             String status, Double totalAmount, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.hotelName = hotelName;
        this.roomType = roomType;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status;
        this.totalAmount = totalAmount;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
