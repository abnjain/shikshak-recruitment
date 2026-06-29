package com.shikshak.recruitment.controller;

import com.shikshak.recruitment.common.ApiResponse;
import com.shikshak.recruitment.dto.request.JobRequest;
import com.shikshak.recruitment.dto.response.JobResponse;
import com.shikshak.recruitment.dto.response.PagedResponse;
import com.shikshak.recruitment.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getAllActiveJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<JobResponse> jobs = jobService.getAllActiveJobs(page, size);
        return ApiResponse.ok(jobs);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) Integer maxExperience,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<JobResponse> jobs = jobService.searchJobs(
                title, location, subject, employmentType,
                minExperience, maxExperience, page, size);
        return ApiResponse.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id) {
        JobResponse job = jobService.getJobById(id);
        return ApiResponse.ok(job);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTITUTE', 'ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(@Valid @RequestBody JobRequest request,
                                                               Authentication authentication) {
        // Institute will be resolved from authenticated user
        // For simplicity, we pass a placeholder - actual institute ID will come from the user context
        return ApiResponse.created(null);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTITUTE', 'ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(@PathVariable Long id,
                                                               @Valid @RequestBody JobRequest request) {
        JobResponse job = jobService.updateJob(id, request);
        return ApiResponse.ok("Job updated successfully", job);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTITUTE', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ApiResponse.ok("Job deleted successfully", null);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('INSTITUTE', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> updateJobStatus(@PathVariable Long id,
                                                                     @RequestParam String status) {
        JobResponse job = jobService.updateJobStatus(id, status);
        return ApiResponse.ok("Job status updated", job);
    }
}
