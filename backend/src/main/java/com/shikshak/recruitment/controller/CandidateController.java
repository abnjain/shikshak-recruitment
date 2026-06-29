package com.shikshak.recruitment.controller;

import com.shikshak.recruitment.common.ApiResponse;
import com.shikshak.recruitment.dto.request.ApplicationRequest;
import com.shikshak.recruitment.dto.request.ProfileUpdateRequest;
import com.shikshak.recruitment.dto.request.ResumeRequest;
import com.shikshak.recruitment.dto.response.*;
import com.shikshak.recruitment.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidate")
@PreAuthorize("hasRole('CANDIDATE')")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateProfileService profileService;
    private final ApplicationService applicationService;
    private final ResumeService resumeService;
    private final UserService userService;
    private final DashboardService dashboardService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> getProfile(Authentication authentication) {
        Long userId = getUserId(authentication);
        CandidateProfileResponse profile = profileService.getProfileByUserId(userId);
        return ApiResponse.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<CandidateProfileResponse>> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request, Authentication authentication) {
        Long userId = getUserId(authentication);
        CandidateProfileResponse profile = profileService.createOrUpdateProfile(userId, request);
        return ApiResponse.ok("Profile updated", profile);
    }

    @PostMapping("/applications")
    public ResponseEntity<ApiResponse<ApplicationResponse>> apply(
            @Valid @RequestBody ApplicationRequest request, Authentication authentication) {
        Long userId = getUserId(authentication);
        ApplicationResponse response = applicationService.apply(request, userId);
        return ApiResponse.created(response);
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        PagedResponse<ApplicationResponse> applications =
                applicationService.getApplicationsByCandidate(userId, page, size);
        return ApiResponse.ok(applications);
    }

    // Resume Builder Endpoints
    @GetMapping("/resumes")
    public ResponseEntity<ApiResponse<List<ResumeResponse>>> getResumes(Authentication authentication) {
        Long userId = getUserId(authentication);
        List<ResumeResponse> resumes = resumeService.getResumesByUserId(userId);
        return ApiResponse.ok(resumes);
    }

    @PostMapping("/resumes")
    public ResponseEntity<ApiResponse<ResumeResponse>> createResume(
            @Valid @RequestBody ResumeRequest request, Authentication authentication) {
        Long userId = getUserId(authentication);
        ResumeResponse resume = resumeService.createResume(request, userId);
        return ApiResponse.created(resume);
    }

    @PutMapping("/resumes/{id}")
    public ResponseEntity<ApiResponse<ResumeResponse>> updateResume(
            @PathVariable Long id, @Valid @RequestBody ResumeRequest request,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        ResumeResponse resume = resumeService.updateResume(id, request, userId);
        return ApiResponse.ok("Resume updated", resume);
    }

    @DeleteMapping("/resumes/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @PathVariable Long id, Authentication authentication) {
        Long userId = getUserId(authentication);
        resumeService.deleteResume(id, userId);
        return ApiResponse.ok("Resume deleted", null);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard(Authentication authentication) {
        Long userId = getUserId(authentication);
        DashboardStatsResponse stats = dashboardService.getCandidateDashboardStats(userId);
        return ApiResponse.ok(stats);
    }

    private Long getUserId(Authentication authentication) {
        return userService.getUserByUsername(authentication.getName()).getId();
    }
}
