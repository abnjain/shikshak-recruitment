package com.shikshak.recruitment.service;

import com.shikshak.recruitment.dto.response.DashboardStatsResponse;
import com.shikshak.recruitment.enums.ApplicationStatus;
import com.shikshak.recruitment.enums.ERole;
import com.shikshak.recruitment.enums.JobStatus;
import com.shikshak.recruitment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final InstituteRepository instituteRepository;

    public DashboardStatsResponse getAdminDashboardStats() {
        LocalDateTime lastWeek = LocalDateTime.now().minusDays(7);

        Map<String, Long> appStatusDist = getApplicationStatusDistribution();
        Map<String, Long> jobStatusDist = getJobStatusDistribution();
        Map<String, Long> monthlyApps = getMonthlyApplications();

        return DashboardStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalJobs(jobRepository.count())
                .totalApplications(applicationRepository.count())
                .activeJobs(jobRepository.countByStatus(JobStatus.ACTIVE))
                .closedJobs(jobRepository.countByStatus(JobStatus.CLOSED))
                .draftJobs(jobRepository.countByStatus(JobStatus.DRAFT))
                .totalInstitutes(userRepository.countByRoleName(ERole.ROLE_INSTITUTE))
                .totalRecruiters(userRepository.countByRoleName(ERole.ROLE_RECRUITER))
                .totalCandidates(userRepository.countByRoleName(ERole.ROLE_CANDIDATE))
                .verifiedInstitutes(instituteRepository.countByIsVerifiedTrue())
                .lastWeekApplications(applicationRepository.countByAppliedAtAfter(lastWeek))
                .lastWeekJobs(jobRepository.countByCreatedAtAfter(lastWeek))
                .applicationStatusDistribution(appStatusDist)
                .jobStatusDistribution(jobStatusDist)
                .monthlyApplications(monthlyApps)
                .build();
    }

    public DashboardStatsResponse getInstituteDashboardStats(Long instituteId) {
        long instituteJobs = jobRepository.countByInstituteId(instituteId);
        long totalApps = 0;

        return DashboardStatsResponse.builder()
                .totalJobs(instituteJobs)
                .activeJobs(jobRepository.countByStatus(JobStatus.ACTIVE))
                .totalApplications(totalApps)
                .build();
    }

    public DashboardStatsResponse getRecruiterDashboardStats(Long recruiterId) {
        List<com.shikshak.recruitment.entity.Job> assignedJobs = jobRepository.findByRecruiterId(recruiterId);
        long jobCount = assignedJobs.size();
        long reviewedApps = applicationRepository.countByReviewedByAndReviewedAtAfter(recruiterId,
                LocalDateTime.now().minusDays(30));

        return DashboardStatsResponse.builder()
                .assignedJobs(jobCount)
                .reviewedApplications(reviewedApps)
                .build();
    }

    public DashboardStatsResponse getCandidateDashboardStats(Long candidateId) {
        long myApps = applicationRepository.countByCandidateId(candidateId);
        long totalJobs = jobRepository.countByStatus(JobStatus.ACTIVE);

        return DashboardStatsResponse.builder()
                .myApplications(myApps)
                .totalJobs(totalJobs)
                .build();
    }

    private Map<String, Long> getApplicationStatusDistribution() {
        List<Object[]> results = applicationRepository.countByStatusGrouped();
        return results.stream()
                .collect(Collectors.toMap(
                        r -> ((ApplicationStatus) r[0]).name(),
                        r -> (Long) r[1]
                ));
    }

    private Map<String, Long> getJobStatusDistribution() {
        Map<String, Long> dist = new HashMap<>();
        for (JobStatus status : JobStatus.values()) {
            dist.put(status.name(), jobRepository.countByStatus(status));
        }
        return dist;
    }

    private Map<String, Long> getMonthlyApplications() {
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        List<Object[]> results = applicationRepository.getMonthlyApplications(sixMonthsAgo);
        Map<String, Long> monthlyData = new HashMap<>();
        for (Object[] row : results) {
            Integer month = ((Number) row[0]).intValue();
            Integer year = ((Number) row[1]).intValue();
            Long count = ((Number) row[2]).longValue();
            String key = String.format("%d-%02d", year, month);
            monthlyData.put(key, count);
        }
        return monthlyData;
    }
}
