package com.shikshak.recruitment.controller;

import com.shikshak.recruitment.common.ApiResponse;
import com.shikshak.recruitment.dto.request.UpdateApplicationStatusRequest;
import com.shikshak.recruitment.dto.response.*;
import com.shikshak.recruitment.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recruiter")
@PreAuthorize("hasRole('RECRUITER')")
@RequiredArgsConstructor
public class RecruiterController {

    private final ApplicationService applicationService;
    private final JobService jobService;
    private final UserService userService;
    private final DashboardService dashboardService;

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getAssignedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        PagedResponse<JobResponse> jobs = jobService.getJobsByRecruiter(userId, page, size);
        return ApiResponse.ok(jobs);
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        PagedResponse<ApplicationResponse> applications =
                applicationService.getApplicationsByRecruiter(userId, page, size);
        return ApiResponse.ok(applications);
    }

    @GetMapping("/applications/job/{jobId}")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getJobApplications(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ApplicationResponse> applications =
                applicationService.getApplicationsByJob(jobId, page, size);
        return ApiResponse.ok(applications);
    }

    @PutMapping("/applications/status")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplicationStatus(
            @Valid @RequestBody UpdateApplicationStatusRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        ApplicationResponse response = applicationService.updateStatus(request, userId);
        return ApiResponse.ok("Application status updated", response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard(Authentication authentication) {
        Long userId = getUserId(authentication);
        DashboardStatsResponse stats = dashboardService.getRecruiterDashboardStats(userId);
        return ApiResponse.ok(stats);
    }

    private Long getUserId(Authentication authentication) {
        return userService.getUserByUsername(authentication.getName()).getId();
    }
}
