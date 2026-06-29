package com.shikshak.recruitment.controller;

import com.shikshak.recruitment.common.ApiResponse;
import com.shikshak.recruitment.dto.request.JobRequest;
import com.shikshak.recruitment.dto.response.*;
import com.shikshak.recruitment.entity.Institute;
import com.shikshak.recruitment.entity.User;
import com.shikshak.recruitment.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/institute")
@PreAuthorize("hasRole('INSTITUTE')")
@RequiredArgsConstructor
public class InstituteController {

    private final InstituteService instituteService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final UserService userService;
    private final DashboardService dashboardService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<InstituteResponse>> getProfile(Authentication authentication) {
        User user = userService.getEntityById(getUserId(authentication));
        Institute institute = instituteService.getEntityByUserId(user.getId());
        return ApiResponse.ok(instituteService.getInstituteById(institute.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<InstituteResponse>> updateProfile(
            @RequestBody InstituteResponse request, Authentication authentication) {
        User user = userService.getEntityById(getUserId(authentication));
        Institute institute = instituteService.getEntityByUserId(user.getId());
        InstituteResponse updated = instituteService.updateInstitute(institute.getId(), request);
        return ApiResponse.ok("Profile updated", updated);
    }

    @PostMapping("/jobs")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(@Valid @RequestBody JobRequest request,
                                                               Authentication authentication) {
        User user = userService.getEntityById(getUserId(authentication));
        Institute institute = instituteService.getEntityByUserId(user.getId());
        JobResponse job = jobService.createJob(request, institute.getId());
        return ApiResponse.created(job);
    }

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getMyJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        User user = userService.getEntityById(getUserId(authentication));
        Institute institute = instituteService.getEntityByUserId(user.getId());
        PagedResponse<JobResponse> jobs = jobService.getJobsByInstitute(institute.getId(), page, size);
        return ApiResponse.ok(jobs);
    }

    @GetMapping("/jobs/all")
    public ResponseEntity<ApiResponse<List<JobResponse>>> getAllMyJobs(Authentication authentication) {
        User user = userService.getEntityById(getUserId(authentication));
        Institute institute = instituteService.getEntityByUserId(user.getId());
        List<JobResponse> jobs = jobService.getAllJobsByInstitute(institute.getId());
        return ApiResponse.ok(jobs);
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        User user = userService.getEntityById(getUserId(authentication));
        Institute institute = instituteService.getEntityByUserId(user.getId());
        PagedResponse<ApplicationResponse> applications =
                applicationService.getApplicationsByInstitute(institute.getId(), page, size);
        return ApiResponse.ok(applications);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard(Authentication authentication) {
        User user = userService.getEntityById(getUserId(authentication));
        Institute institute = instituteService.getEntityByUserId(user.getId());
        DashboardStatsResponse stats = dashboardService.getInstituteDashboardStats(institute.getId());
        return ApiResponse.ok(stats);
    }

    private Long getUserId(Authentication authentication) {
        UserResponse user = userService.getUserByUsername(authentication.getName());
        return user.getId();
    }
}
