package com.shikshak.recruitment.repository;

import com.shikshak.recruitment.entity.Application;
import com.shikshak.recruitment.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Page<Application> findByJobId(Long jobId, Pageable pageable);

    List<Application> findByJobId(Long jobId);

    Page<Application> findByCandidateId(Long candidateId, Pageable pageable);

    List<Application> findByCandidateId(Long candidateId);

    Page<Application> findByStatus(ApplicationStatus status, Pageable pageable);

    Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);

    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);

    long countByJobId(Long jobId);

    long countByCandidateId(Long candidateId);

    long countByStatus(ApplicationStatus status);

    long countByAppliedAtAfter(LocalDateTime since);

    @Query("SELECT a FROM Application a WHERE a.job.institute.id = :instituteId")
    Page<Application> findByInstituteId(@Param("instituteId") Long instituteId, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter.id = :recruiterId")
    Page<Application> findByRecruiterId(@Param("recruiterId") Long recruiterId, Pageable pageable);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countByStatusGrouped();

    @Query(value = "SELECT EXTRACT(YEAR FROM a.applied_at), EXTRACT(MONTH FROM a.applied_at), COUNT(a) " +
           "FROM applications a WHERE a.applied_at >= :since GROUP BY EXTRACT(YEAR FROM a.applied_at), EXTRACT(MONTH FROM a.applied_at) ORDER BY EXTRACT(YEAR FROM a.applied_at), EXTRACT(MONTH FROM a.applied_at)",
           nativeQuery = true)
    List<Object[]> getMonthlyApplications(@Param("since") LocalDateTime since);

    long countByReviewedByAndReviewedAtAfter(Long reviewerId, LocalDateTime since);
}
