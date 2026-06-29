package com.shikshak.recruitment.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {

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
}
