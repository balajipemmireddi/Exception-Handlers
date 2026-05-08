package com.hotel.dto;

/**
 * Phase 11: System Analytics DTO
 * High-level system analytics for SUPER_ADMIN.
 */
public class SystemAnalyticsDTO {
    
    private Long totalUsers;
    private Long totalHotels;
    private Long totalRooms;
    private Long totalBookings;
    private String mostBookedHotel;
    private String topLocation;
    private Double occupancyRate;    // percentage

    // Constructors
    public SystemAnalyticsDTO() {
    }

    public SystemAnalyticsDTO(Long totalUsers, Long totalHotels, Long totalRooms, 
                             Long totalBookings, String mostBookedHotel, 
                             String topLocation, Double occupancyRate) {
        this.totalUsers = totalUsers;
        this.totalHotels = totalHotels;
        this.totalRooms = totalRooms;
        this.totalBookings = totalBookings;
        this.mostBookedHotel = mostBookedHotel;
        this.topLocation = topLocation;
        this.occupancyRate = occupancyRate;
    }

    // Getters and Setters
    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalHotels() {
        return totalHotels;
    }

    public void setTotalHotels(Long totalHotels) {
        this.totalHotels = totalHotels;
    }

    public Long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(Long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public Long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public String getMostBookedHotel() {
        return mostBookedHotel;
    }

    public void setMostBookedHotel(String mostBookedHotel) {
        this.mostBookedHotel = mostBookedHotel;
    }

    public String getTopLocation() {
        return topLocation;
    }

    public void setTopLocation(String topLocation) {
        this.topLocation = topLocation;
    }

    public Double getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(Double occupancyRate) {
        this.occupancyRate = occupancyRate;
    }
}