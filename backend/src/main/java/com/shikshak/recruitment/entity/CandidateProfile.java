package com.shikshak.recruitment.entity;

import com.shikshak.recruitment.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    private LocalDate dateOfBirth;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 20)
    private String pincode;

    @Column(name = "highest_qualification", length = 100)
    private String highestQualification;

    @Column(name = "specialization", length = 200)
    private String specialization;

    @Column(name = "total_experience_years")
    private Double totalExperienceYears;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "current_employer", length = 200)
    private String currentEmployer;

    @Column(name = "current_position", length = 100)
    private String currentPosition;

    @Column(name = "preferred_subjects", length = 500)
    private String preferredSubjects;

    @Column(name = "preferred_locations", length = 500)
    private String preferredLocations;

    @Column(name = "expected_salary_min")
    private Double expectedSalaryMin;

    @Column(name = "expected_salary_max")
    private Double expectedSalaryMax;

    @Column(name = "is_open_to_relocate")
    private boolean isOpenToRelocate = false;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
