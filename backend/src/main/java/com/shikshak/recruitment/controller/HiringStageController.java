package com.shikshak.recruitment.controller;

import com.shikshak.recruitment.common.ApiResponse;
import com.shikshak.recruitment.dto.request.HiringStageRequest;
import com.shikshak.recruitment.dto.response.HiringStageResponse;
import com.shikshak.recruitment.service.HiringStageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hiring-stages")
@RequiredArgsConstructor
public class HiringStageController {

    private final HiringStageService hiringStageService;

    @GetMapping("/job/{jobId}")
    public ResponseEntity<ApiResponse<List<HiringStageResponse>>> getStagesByJob(@PathVariable Long jobId) {
        List<HiringStageResponse> stages = hiringStageService.getStagesByJobId(jobId);
        return ApiResponse.ok(stages);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTITUTE', 'ADMIN')")
    public ResponseEntity<ApiResponse<HiringStageResponse>> createStage(
            @Valid @RequestBody HiringStageRequest request) {
        HiringStageResponse stage = hiringStageService.createStage(request);
        return ApiResponse.created(stage);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTITUTE', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteStage(@PathVariable Long id) {
        hiringStageService.deleteStage(id);
        return ApiResponse.ok("Stage deleted", null);
    }

    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasAnyRole('INSTITUTE', 'ADMIN')")
    public ResponseEntity<ApiResponse<HiringStageResponse>> toggleStage(@PathVariable Long id) {
        HiringStageResponse stage = hiringStageService.toggleStageActive(id);
        return ApiResponse.ok("Stage toggled", stage);
    }
}
