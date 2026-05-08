package com.hotel.controller;

import com.hotel.dto.RevenueDTO;
import com.hotel.dto.SystemAnalyticsDTO;
import com.hotel.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Phase 11: Super Admin Controller
 * Handles SUPER_ADMIN operations for analytics and revenue data.
 */
@RestController
@RequestMapping("/api/superadmin")
@CrossOrigin
public class SuperAdminController {

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * GET /api/superadmin/revenue
     * Financial earnings and revenue data (SUPER_ADMIN).
     * Returns RevenueDTO.
     */
    @GetMapping("/revenue")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<RevenueDTO> getRevenueAnalytics() {
        RevenueDTO revenue = analyticsService.getRevenueAnalytics();
        return ResponseEntity.ok(revenue);
    }

    /**
     * GET /api/superadmin/analytics
     * High-level system analytics (SUPER_ADMIN).
     * Returns SystemAnalyticsDTO.
     */
    @GetMapping("/analytics")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<SystemAnalyticsDTO> getSystemAnalytics() {
        SystemAnalyticsDTO analytics = analyticsService.getSystemAnalytics();
        return ResponseEntity.ok(analytics);
    }
}