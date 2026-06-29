package com.shikshak.recruitment.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfileResponse {

    private Long id;
    private String fullName;
    private String gender;
    private LocalDate dateOfBirth;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String highestQualification;
    private String specialization;
    private Double totalExperienceYears;
    private String skills;
    private String bio;
    private String currentEmployer;
    private String currentPosition;
    private String preferredSubjects;
    private String preferredLocations;
    private Double expectedSalaryMin;
    private Double expectedSalaryMax;
    private boolean isOpenToRelocate;
    private String resumeUrl;
    private String profilePictureUrl;
    private Long userId;
    private String userEmail;
    private String username;
    private LocalDateTime createdAt;
}
