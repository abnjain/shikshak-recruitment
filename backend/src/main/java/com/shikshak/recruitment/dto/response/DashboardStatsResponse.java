package com.shikshak.recruitment.dto.response;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    // Common
    private long totalUsers;
    private long totalJobs;
    private long totalApplications;

    // Jobs by status
    private long activeJobs;
    private long closedJobs;
    private long draftJobs;

    // Applications by status
    private long appliedCount;
    private long shortlistedCount;
    private long interviewedCount;
    private long selectedCount;
    private long rejectedCount;
    private long hiredCount;

    // Admin specific
    private long totalInstitutes;
    private long totalRecruiters;
    private long totalCandidates;
    private long verifiedInstitutes;

    // Institute specific
    private long instituteJobs;

    // Recruiter specific
    private long assignedJobs;
    private long reviewedApplications;

    // Candidate specific
    private long myApplications;

    // Recent activity
    private long lastWeekApplications;
    private long lastWeekJobs;

    // Status distribution (for charts)
    private Map<String, Long> applicationStatusDistribution;
    private Map<String, Long> jobStatusDistribution;
    private Map<String, Long> monthlyApplications;
}
