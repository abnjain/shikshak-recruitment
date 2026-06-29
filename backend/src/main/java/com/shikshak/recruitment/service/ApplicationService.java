package com.shikshak.recruitment.service;

import com.shikshak.recruitment.common.BadRequestException;
import com.shikshak.recruitment.common.DuplicateResourceException;
import com.shikshak.recruitment.common.ResourceNotFoundException;
import com.shikshak.recruitment.dto.request.ApplicationRequest;
import com.shikshak.recruitment.dto.request.UpdateApplicationStatusRequest;
import com.shikshak.recruitment.dto.response.ApplicationResponse;
import com.shikshak.recruitment.dto.response.PagedResponse;
import com.shikshak.recruitment.entity.Application;
import com.shikshak.recruitment.entity.HiringStage;
import com.shikshak.recruitment.entity.Job;
import com.shikshak.recruitment.entity.User;
import com.shikshak.recruitment.enums.ApplicationStatus;
import com.shikshak.recruitment.enums.JobStatus;
import com.shikshak.recruitment.mapper.ApplicationMapper;
import com.shikshak.recruitment.repository.ApplicationRepository;
import com.shikshak.recruitment.repository.HiringStageRepository;
import com.shikshak.recruitment.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final HiringStageRepository hiringStageRepository;
    private final ApplicationMapper applicationMapper;

    @Transactional
    public ApplicationResponse apply(ApplicationRequest request, Long candidateId) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", request.getJobId()));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("Cannot apply to a job that is not active");
        }

        if (applicationRepository.existsByJobIdAndCandidateId(request.getJobId(), candidateId)) {
            throw new DuplicateResourceException("You have already applied to this job");
        }

        // Get the first hiring stage as default
        List<HiringStage> stages = hiringStageRepository
                .findByJobIdAndIsActiveTrueOrderByStageOrderAsc(request.getJobId());
        HiringStage firstStage = stages.isEmpty() ? null : stages.get(0);

        Application application = Application.builder()
                .job(job)
                .candidate(User.builder().id(candidateId).build())
                .coverLetter(request.getCoverLetter())
                .resumeUrl(request.getResumeUrl())
                .additionalDocumentsUrl(request.getAdditionalDocumentsUrl())
                .status(ApplicationStatus.APPLIED)
                .currentStage(firstStage)
                .build();

        application = applicationRepository.save(application);
        log.info("Application created: candidate {} applied for job {}", candidateId, job.getTitle());
        return applicationMapper.toResponse(application);
    }

    @Transactional
    public ApplicationResponse updateStatus(UpdateApplicationStatusRequest request, Long reviewerId) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", request.getApplicationId()));

        ApplicationStatus newStatus;
        try {
            newStatus = ApplicationStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid application status: " + request.getStatus());
        }

        application.setStatus(newStatus);
        application.setReviewedBy(reviewerId);
        application.setReviewedAt(LocalDateTime.now());

        if (request.getRecruiterNotes() != null) {
            application.setRecruiterNotes(request.getRecruiterNotes());
        }
        if (request.getFeedback() != null) {
            application.setFeedback(request.getFeedback());
        }

        application = applicationRepository.save(application);
        log.info("Application {} status updated to {}", request.getApplicationId(), newStatus);
        return applicationMapper.toResponse(application);
    }

    public PagedResponse<ApplicationResponse> getApplicationsByJob(Long jobId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> applications = applicationRepository.findByJobId(jobId, pageable);
        return toPagedResponse(applications);
    }

    public PagedResponse<ApplicationResponse> getApplicationsByCandidate(Long candidateId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> applications = applicationRepository.findByCandidateId(candidateId, pageable);
        return toPagedResponse(applications);
    }

    public PagedResponse<ApplicationResponse> getApplicationsByInstitute(Long instituteId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> applications = applicationRepository.findByInstituteId(instituteId, pageable);
        return toPagedResponse(applications);
    }

    public PagedResponse<ApplicationResponse> getApplicationsByRecruiter(Long recruiterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> applications = applicationRepository.findByRecruiterId(recruiterId, pageable);
        return toPagedResponse(applications);
    }

    public ApplicationResponse getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));
        return applicationMapper.toResponse(application);
    }

    public boolean hasApplied(Long jobId, Long candidateId) {
        return applicationRepository.existsByJobIdAndCandidateId(jobId, candidateId);
    }

    @Transactional
    public ApplicationResponse moveToNextStage(Long applicationId, Long stageId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        HiringStage stage = hiringStageRepository.findById(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("HiringStage", "id", stageId));

        application.setCurrentStage(stage);
        application = applicationRepository.save(application);
        return applicationMapper.toResponse(application);
    }

    private PagedResponse<ApplicationResponse> toPagedResponse(Page<Application> page) {
        List<ApplicationResponse> content = page.getContent().stream()
                .map(applicationMapper::toResponse)
                .collect(Collectors.toList());
        return PagedResponse.<ApplicationResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .first(page.isFirst())
                .build();
    }
}
