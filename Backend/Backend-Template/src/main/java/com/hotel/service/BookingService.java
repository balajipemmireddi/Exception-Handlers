package com.hotel.service;

import com.hotel.dto.BookingRequestDTO;
import com.hotel.dto.BookingResponseDTO;
import com.hotel.dto.BookingUpdateDTO;
import com.hotel.entity.Booking;
import com.hotel.entity.Hotel;
import com.hotel.entity.Room;
import com.hotel.entity.Users;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.exception.UnauthorizedResourceAccessException;
import com.hotel.mapper.BookingMapper;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Phase 9: Booking Service
 * Business logic for user booking operations.
 * Updated to use BookingMapper for entity-DTO conversion.
 */
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingMapper bookingMapper;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    /**
     * Create a new booking (USER operation).
     */
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validate hotel exists
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + request.getHotelId()));

        // Validate room exists and belongs to hotel
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        if (!room.getHotel().getId().equals(hotel.getId())) {
            throw new IllegalArgumentException("Room does not belong to the specified hotel");
        }

        // Check room availability
        if (!room.getAvailable()) {
            throw new IllegalArgumentException("Room is not available for booking");
        }

        // Parse dates
        LocalDate checkIn = LocalDate.parse(request.getCheckIn(), DATE_FORMATTER);
        LocalDate checkOut = LocalDate.parse(request.getCheckOut(), DATE_FORMATTER);

        // Validate dates
        if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }

        // Calculate total amount
        long numberOfNights = ChronoUnit.DAYS.between(checkIn, checkOut);
        Double totalAmount = room.getPrice() * numberOfNights;

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setHotel(hotel);
        booking.setRoom(room);
        booking.setCheckIn(checkIn);
        booking.setCheckOut(checkOut);
        booking.setTotalAmount(totalAmount);
        booking.setStatus("CONFIRMED");

        Booking savedBooking = bookingRepository.save(booking);
        return bookingMapper.toResponseDTO(savedBooking);
    }

    /**
     * Get all bookings for a specific user (USER operation - own only).
     */
    public List<BookingResponseDTO> getUserBookings(Long userId) {
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Users currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user is accessing their own bookings
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedResourceAccessException("You can only view your own bookings");
        }

        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookingMapper.toResponseDTOs(bookings);
    }

    /**
     * Cancel a booking (USER operation - own only).
     */
    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId) {
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Users currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Find booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Check if user owns this booking
        if (!booking.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedResourceAccessException("You can only cancel your own bookings");
        }

        // Update status to CANCELLED
        booking.setStatus("CANCELLED");
        Booking updatedBooking = bookingRepository.save(booking);
        return bookingMapper.toResponseDTO(updatedBooking);
    }

    // ========== ADMIN OPERATIONS (Phase 10) ==========

    /**
     * Get all bookings in the system (ADMIN operation).
     */
    public List<BookingResponseDTO> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookingMapper.toResponseDTOs(bookings);
    }

    /**
     * Update a booking (ADMIN operation).
     */
    @Transactional
    public BookingResponseDTO updateBooking(Long bookingId, BookingUpdateDTO request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Update fields if provided
        if (request.getCheckIn() != null && !request.getCheckIn().trim().isEmpty()) {
            LocalDate checkIn = LocalDate.parse(request.getCheckIn(), DATE_FORMATTER);
            booking.setCheckIn(checkIn);
        }

        if (request.getCheckOut() != null && !request.getCheckOut().trim().isEmpty()) {
            LocalDate checkOut = LocalDate.parse(request.getCheckOut(), DATE_FORMATTER);
            booking.setCheckOut(checkOut);
        }

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            booking.setStatus(request.getStatus());
        }

        // Recalculate total amount if dates changed
        if (request.getCheckIn() != null || request.getCheckOut() != null) {
            long numberOfNights = ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut());
            if (numberOfNights > 0) {
                Double totalAmount = booking.getRoom().getPrice() * numberOfNights;
                booking.setTotalAmount(totalAmount);
            }
        }

        Booking updatedBooking = bookingRepository.save(booking);
        return bookingMapper.toResponseDTO(updatedBooking);
    }

    /**
     * Hard delete a booking (ADMIN operation).
     */
    @Transactional
    public void deleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        bookingRepository.delete(booking);
    }
}
