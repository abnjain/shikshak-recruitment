package com.shikshak.recruitment.service;

import com.shikshak.recruitment.common.BadRequestException;
import com.shikshak.recruitment.common.ResourceNotFoundException;
import com.shikshak.recruitment.dto.request.JobRequest;
import com.shikshak.recruitment.dto.response.JobResponse;
import com.shikshak.recruitment.dto.response.PagedResponse;
import com.shikshak.recruitment.entity.Institute;
import com.shikshak.recruitment.entity.Job;
import com.shikshak.recruitment.entity.User;
import com.shikshak.recruitment.enums.EmploymentType;
import com.shikshak.recruitment.enums.JobStatus;
import com.shikshak.recruitment.mapper.JobMapper;
import com.shikshak.recruitment.repository.InstituteRepository;
import com.shikshak.recruitment.repository.JobRepository;
import com.shikshak.recruitment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;
    private final InstituteRepository instituteRepository;
    private final UserRepository userRepository;
    private final JobMapper jobMapper;

    public PagedResponse<JobResponse> getAllActiveJobs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = jobRepository.findAllActiveJobs(pageable);
        return toPagedResponse(jobs);
    }

    public PagedResponse<JobResponse> searchJobs(String title, String location, String subject,
                                                   String employmentType, Integer minExp,
                                                   Integer maxExp, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        EmploymentType empType = null;
        if (employmentType != null && !employmentType.isEmpty()) {
            try {
                empType = EmploymentType.valueOf(employmentType.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid employment type: " + employmentType);
            }
        }
        Page<Job> jobs = jobRepository.searchJobs(title, location, subject, empType, minExp, maxExp, pageable);
        return toPagedResponse(jobs);
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        return jobMapper.toResponse(job);
    }

    @Transactional
    public JobResponse createJob(JobRequest request, Long instituteId) {
        Institute institute = instituteRepository.findById(instituteId)
                .orElseThrow(() -> new ResourceNotFoundException("Institute", "id", instituteId));

        JobStatus status = JobStatus.DRAFT;
        if (request.getStatus() != null) {
            try {
                status = JobStatus.valueOf(request.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid job status: " + request.getStatus());
            }
        }

        EmploymentType empType = null;
        if (request.getEmploymentType() != null) {
            try {
                empType = EmploymentType.valueOf(request.getEmploymentType().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid employment type: " + request.getEmploymentType());
            }
        }

        User recruiter = null;
        if (request.getRecruiterId() != null) {
            recruiter = userRepository.findById(request.getRecruiterId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getRecruiterId()));
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .responsibilities(request.getResponsibilities())
                .location(request.getLocation())
                .minSalary(request.getMinSalary())
                .maxSalary(request.getMaxSalary())
                .subject(request.getSubject())
                .minExperienceYears(request.getMinExperienceYears())
                .maxExperienceYears(request.getMaxExperienceYears())
                .qualificationRequired(request.getQualificationRequired())
                .employmentType(empType)
                .positionsAvailable(request.getPositionsAvailable() != null ? request.getPositionsAvailable() : 1)
                .applicationDeadline(request.getApplicationDeadline())
                .status(status)
                .isRemote(request.isRemote())
                .institute(institute)
                .recruiter(recruiter)
                .build();

        if (status == JobStatus.ACTIVE) {
            job.setPublishedAt(LocalDateTime.now());
        }

        job = jobRepository.save(job);
        log.info("Job created: {} for institute: {}", job.getTitle(), institute.getInstituteName());
        return jobMapper.toResponse(job);
    }

    @Transactional
    public JobResponse updateJob(Long id, JobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getRequirements() != null) job.setRequirements(request.getRequirements());
        if (request.getResponsibilities() != null) job.setResponsibilities(request.getResponsibilities());
        if (request.getLocation() != null) job.setLocation(request.getLocation());
        if (request.getMinSalary() != null) job.setMinSalary(request.getMinSalary());
        if (request.getMaxSalary() != null) job.setMaxSalary(request.getMaxSalary());
        if (request.getSubject() != null) job.setSubject(request.getSubject());
        if (request.getMinExperienceYears() != null) job.setMinExperienceYears(request.getMinExperienceYears());
        if (request.getMaxExperienceYears() != null) job.setMaxExperienceYears(request.getMaxExperienceYears());
        if (request.getQualificationRequired() != null) job.setQualificationRequired(request.getQualificationRequired());
        if (request.getEmploymentType() != null) {
            job.setEmploymentType(EmploymentType.valueOf(request.getEmploymentType().toUpperCase()));
        }
        if (request.getPositionsAvailable() != null) job.setPositionsAvailable(request.getPositionsAvailable());
        if (request.getApplicationDeadline() != null) job.setApplicationDeadline(request.getApplicationDeadline());
        if (request.getStatus() != null) {
            JobStatus newStatus = JobStatus.valueOf(request.getStatus().toUpperCase());
            job.setStatus(newStatus);
            if (newStatus == JobStatus.ACTIVE && job.getPublishedAt() == null) {
                job.setPublishedAt(LocalDateTime.now());
            }
        }
        job.setRemote(request.isRemote());

        job = jobRepository.save(job);
        return jobMapper.toResponse(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        jobRepository.delete(job);
    }

    @Transactional
    public JobResponse updateJobStatus(Long id, String status) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        JobStatus newStatus;
        try {
            newStatus = JobStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid job status: " + status);
        }
        job.setStatus(newStatus);
        if (newStatus == JobStatus.ACTIVE && job.getPublishedAt() == null) {
            job.setPublishedAt(LocalDateTime.now());
        }
        job = jobRepository.save(job);
        return jobMapper.toResponse(job);
    }

    public PagedResponse<JobResponse> getJobsByInstitute(Long instituteId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = jobRepository.findByInstituteId(instituteId, pageable);
        return toPagedResponse(jobs);
    }

    public PagedResponse<JobResponse> getJobsByRecruiter(Long recruiterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = jobRepository.findByRecruiterId(recruiterId, pageable);
        return toPagedResponse(jobs);
    }

    public List<JobResponse> getAllJobsByInstitute(Long instituteId) {
        return jobRepository.findByInstituteId(instituteId).stream()
                .map(jobMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Async
    public void expireOldJobs() {
        List<Job> activeJobs = jobRepository.findByStatus(JobStatus.ACTIVE);
        LocalDateTime now = LocalDateTime.now();
        for (Job job : activeJobs) {
            if (job.getApplicationDeadline() != null &&
                job.getApplicationDeadline().isBefore(java.time.LocalDate.now())) {
                job.setStatus(JobStatus.EXPIRED);
                jobRepository.save(job);
                log.info("Job expired: {} (deadline was {})", job.getTitle(), job.getApplicationDeadline());
            }
        }
    }

    private PagedResponse<JobResponse> toPagedResponse(Page<Job> page) {
        List<JobResponse> content = page.getContent().stream()
                .map(jobMapper::toResponse)
                .collect(Collectors.toList());
        return PagedResponse.<JobResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .first(page.isFirst())
                .build();
    }

    public Job getEntityById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
    }
}
