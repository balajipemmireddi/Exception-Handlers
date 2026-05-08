package com.hotel.repository;

import com.hotel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Phase 8: Room Repository
 * Provides CRUD operations for Room entity.
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    List<Room> findByHotelId(Long hotelId);
}
