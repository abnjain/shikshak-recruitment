package com.shikshak.recruitment.controller;

import com.shikshak.recruitment.common.ApiResponse;
import com.shikshak.recruitment.dto.response.InstituteResponse;
import com.shikshak.recruitment.dto.response.JobResponse;
import com.shikshak.recruitment.dto.response.PagedResponse;
import com.shikshak.recruitment.service.InstituteService;
import com.shikshak.recruitment.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class PublicController {

    private final JobService jobService;
    private final InstituteService instituteService;

    @GetMapping("/jobs")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> getActiveJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<JobResponse> jobs = jobService.getAllActiveJobs(page, size);
        return ApiResponse.ok(jobs);
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobDetails(@PathVariable Long id) {
        JobResponse job = jobService.getJobById(id);
        return ApiResponse.ok(job);
    }

    @GetMapping("/jobs/search")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponse>>> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<JobResponse> jobs = jobService.searchJobs(
                title, location, subject, employmentType, minExperience, null, page, size);
        return ApiResponse.ok(jobs);
    }

    @GetMapping("/institutes")
    public ResponseEntity<ApiResponse<List<InstituteResponse>>> getVerifiedInstitutes() {
        List<InstituteResponse> institutes = instituteService.getAllInstitutes();
        return ApiResponse.ok(institutes);
    }
}
