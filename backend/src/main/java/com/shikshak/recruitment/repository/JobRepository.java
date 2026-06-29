package com.shikshak.recruitment.repository;

import com.shikshak.recruitment.entity.Job;
import com.shikshak.recruitment.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByInstituteId(Long instituteId, Pageable pageable);

    List<Job> findByInstituteId(Long instituteId);

    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    List<Job> findByStatus(JobStatus status);

    Page<Job> findByRecruiterId(Long recruiterId, Pageable pageable);

    List<Job> findByRecruiterId(Long recruiterId);

    long countByInstituteId(Long instituteId);

    long countByStatus(JobStatus status);

    long countByCreatedAtAfter(LocalDateTime since);

    // Search and filter
    @Query("SELECT j FROM Job j WHERE " +
           "(:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:subject IS NULL OR LOWER(j.subject) LIKE LOWER(CONCAT('%', :subject, '%'))) AND " +
           "(:employmentType IS NULL OR j.employmentType = :employmentType) AND " +
           "(:minExperience IS NULL OR j.minExperienceYears >= :minExperience) AND " +
           "(:maxExperience IS NULL OR j.maxExperienceYears <= :maxExperience) AND " +
           "j.status = 'ACTIVE' " +
           "ORDER BY j.createdAt DESC")
    Page<Job> searchJobs(@Param("title") String title,
                         @Param("location") String location,
                         @Param("subject") String subject,
                         @Param("employmentType") com.shikshak.recruitment.enums.EmploymentType employmentType,
                         @Param("minExperience") Integer minExperience,
                         @Param("maxExperience") Integer maxExperience,
                         Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' ORDER BY j.createdAt DESC")
    Page<Job> findAllActiveJobs(Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.institute.id IN :instituteIds AND j.status = :status")
    List<Job> findByInstituteIdsAndStatus(@Param("instituteIds") List<Long> instituteIds,
                                          @Param("status") JobStatus status);
}
