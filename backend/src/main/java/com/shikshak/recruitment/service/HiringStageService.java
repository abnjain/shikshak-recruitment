package com.shikshak.recruitment.service;

import com.shikshak.recruitment.common.ResourceNotFoundException;
import com.shikshak.recruitment.dto.request.HiringStageRequest;
import com.shikshak.recruitment.dto.response.HiringStageResponse;
import com.shikshak.recruitment.entity.HiringStage;
import com.shikshak.recruitment.entity.Job;
import com.shikshak.recruitment.mapper.HiringStageMapper;
import com.shikshak.recruitment.repository.HiringStageRepository;
import com.shikshak.recruitment.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HiringStageService {

    private final HiringStageRepository hiringStageRepository;
    private final JobRepository jobRepository;
    private final HiringStageMapper hiringStageMapper;

    public List<HiringStageResponse> getStagesByJobId(Long jobId) {
        return hiringStageRepository.findByJobIdOrderByStageOrderAsc(jobId).stream()
                .map(hiringStageMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public HiringStageResponse createStage(HiringStageRequest request) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", request.getJobId()));

        HiringStage stage = HiringStage.builder()
                .stageName(request.getStageName())
                .stageOrder(request.getStageOrder())
                .description(request.getDescription())
                .isActive(true)
                .job(job)
                .build();

        stage = hiringStageRepository.save(stage);
        return hiringStageMapper.toResponse(stage);
    }

    @Transactional
    public void deleteStage(Long id) {
        HiringStage stage = hiringStageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HiringStage", "id", id));
        hiringStageRepository.delete(stage);
    }

    @Transactional
    public HiringStageResponse toggleStageActive(Long id) {
        HiringStage stage = hiringStageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HiringStage", "id", id));
        stage.setActive(!stage.isActive());
        stage = hiringStageRepository.save(stage);
        return hiringStageMapper.toResponse(stage);
    }
}
