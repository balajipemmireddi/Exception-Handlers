package com.hotel.service;

import com.hotel.dto.RevenueDTO;
import com.hotel.dto.SystemAnalyticsDTO;
import com.hotel.entity.Booking;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Phase 11: Analytics Service
 * Business logic for SUPER_ADMIN analytics and revenue calculations.
 */
@Service
public class AnalyticsService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    /**
     * Calculate revenue analytics.
     */
    public RevenueDTO getRevenueAnalytics() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        // Calculate total revenue from confirmed bookings
        Double totalRevenue = allBookings.stream()
                .filter(booking -> "CONFIRMED".equals(booking.getStatus()))
                .mapToDouble(Booking::getTotalAmount)
                .sum();

        // Calculate monthly revenue (current month)
        YearMonth currentMonth = YearMonth.now();
        Double monthlyRevenue = allBookings.stream()
                .filter(booking -> "CONFIRMED".equals(booking.getStatus()))
                .filter(booking -> {
                    LocalDateTime createdAt = booking.getCreatedAt();
                    return createdAt != null && 
                           YearMonth.from(createdAt).equals(currentMonth);
                })
                .mapToDouble(Booking::getTotalAmount)
                .sum();

        // Calculate daily revenue (today)
        LocalDate today = LocalDate.now();
        Double dailyRevenue = allBookings.stream()
                .filter(booking -> "CONFIRMED".equals(booking.getStatus()))
                .filter(booking -> {
                    LocalDateTime createdAt = booking.getCreatedAt();
                    return createdAt != null && 
                           createdAt.toLocalDate().equals(today);
                })
                .mapToDouble(Booking::getTotalAmount)
                .sum();

        // Count bookings by status
        Long totalBookings = (long) allBookings.size();
        Long confirmedBookings = allBookings.stream()
                .filter(booking -> "CONFIRMED".equals(booking.getStatus()))
                .mapToLong(booking -> 1L)
                .sum();
        Long cancelledBookings = allBookings.stream()
                .filter(booking -> "CANCELLED".equals(booking.getStatus()))
                .mapToLong(booking -> 1L)
                .sum();

        return new RevenueDTO(
                totalRevenue,
                monthlyRevenue,
                dailyRevenue,
                totalBookings,
                confirmedBookings,
                cancelledBookings
        );
    }

    /**
     * Calculate system analytics.
     */
    public SystemAnalyticsDTO getSystemAnalytics() {
        // Count totals
        Long totalUsers = userRepository.count();
        Long totalHotels = hotelRepository.count();
        Long totalRooms = roomRepository.count();
        Long totalBookings = bookingRepository.count();

        // Find most booked hotel
        String mostBookedHotel = findMostBookedHotel();

        // Find top location
        String topLocation = findTopLocation();

        // Calculate occupancy rate (simplified calculation)
        Double occupancyRate = calculateOccupancyRate();

        return new SystemAnalyticsDTO(
                totalUsers,
                totalHotels,
                totalRooms,
                totalBookings,
                mostBookedHotel,
                topLocation,
                occupancyRate
        );
    }

    /**
     * Find the most booked hotel by counting bookings per hotel.
     */
    private String findMostBookedHotel() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        if (allBookings.isEmpty()) {
            return "No bookings yet";
        }

        Map<String, Long> hotelBookingCounts = allBookings.stream()
                .collect(Collectors.groupingBy(
                        booking -> booking.getHotel().getName(),
                        Collectors.counting()
                ));

        return hotelBookingCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("No bookings yet");
    }

    /**
     * Find the top location by counting bookings per location.
     */
    private String findTopLocation() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        if (allBookings.isEmpty()) {
            return "No bookings yet";
        }

        Map<String, Long> locationBookingCounts = allBookings.stream()
                .collect(Collectors.groupingBy(
                        booking -> booking.getHotel().getLocation(),
                        Collectors.counting()
                ));

        return locationBookingCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("No bookings yet");
    }

    /**
     * Calculate occupancy rate as percentage of confirmed bookings vs total rooms.
     * Simplified calculation: (confirmed bookings / total rooms) * 100
     */
    private Double calculateOccupancyRate() {
        Long totalRooms = roomRepository.count();
        if (totalRooms == 0) {
            return 0.0;
        }

        Long confirmedBookings = bookingRepository.findAll().stream()
                .filter(booking -> "CONFIRMED".equals(booking.getStatus()))
                .mapToLong(booking -> 1L)
                .sum();

        return (confirmedBookings.doubleValue() / totalRooms.doubleValue()) * 100.0;
    }
}