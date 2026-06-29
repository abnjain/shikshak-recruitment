package com.shikshak.recruitment.controller;

import com.shikshak.recruitment.common.ApiResponse;
import com.shikshak.recruitment.dto.response.*;
import com.shikshak.recruitment.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final InstituteService instituteService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard() {
        DashboardStatsResponse stats = dashboardService.getAdminDashboardStats();
        return ApiResponse.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ApiResponse.ok(users);
    }

    @GetMapping("/institutes")
    public ResponseEntity<ApiResponse<List<InstituteResponse>>> getAllInstitutes() {
        List<InstituteResponse> institutes = instituteService.getAllInstitutes();
        return ApiResponse.ok(institutes);
    }

    @PutMapping("/institutes/{id}/verify")
    public ResponseEntity<ApiResponse<InstituteResponse>> verifyInstitute(@PathVariable Long id) {
        InstituteResponse institute = instituteService.verifyInstitute(id);
        return ApiResponse.ok("Institute verified successfully", institute);
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllJobs() {
        // Return all jobs (admin view)
        return ApiResponse.ok(null);
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getAllApplications() {
        return ApiResponse.ok(null);
    }

    @PutMapping("/users/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Void>> toggleUserActive(@PathVariable Long id,
                                                                @RequestParam boolean active) {
        userService.toggleUserActiveStatus(id, active);
        return ApiResponse.ok("User status updated", null);
    }
}
