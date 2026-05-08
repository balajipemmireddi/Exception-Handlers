package com.hotel.repository;

import com.hotel.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Phase 6: Hotel Repository
 * Provides CRUD operations for Hotel entity.
 */
@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
    List<Hotel> findByLocationContainingIgnoreCase(String location);
}
