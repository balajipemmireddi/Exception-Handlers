package com.hotel.dto;

/**
 * Phase 11: Revenue DTO
 * Financial earnings and revenue data for SUPER_ADMIN.
 */
public class RevenueDTO {
    
    private Double totalRevenue;
    private Double monthlyRevenue;   // current month
    private Double dailyRevenue;     // today
    private Long totalBookings;
    private Long confirmedBookings;
    private Long cancelledBookings;

    // Constructors
    public RevenueDTO() {
    }

    public RevenueDTO(Double totalRevenue, Double monthlyRevenue, Double dailyRevenue, 
                     Long totalBookings, Long confirmedBookings, Long cancelledBookings) {
        this.totalRevenue = totalRevenue;
        this.monthlyRevenue = monthlyRevenue;
        this.dailyRevenue = dailyRevenue;
        this.totalBookings = totalBookings;
        this.confirmedBookings = confirmedBookings;
        this.cancelledBookings = cancelledBookings;
    }

    // Getters and Setters
    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Double getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(Double monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    public Double getDailyRevenue() {
        return dailyRevenue;
    }

    public void setDailyRevenue(Double dailyRevenue) {
        this.dailyRevenue = dailyRevenue;
    }

    public Long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public Long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(Long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }

    public Long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(Long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }
}