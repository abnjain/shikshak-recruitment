package com.shikshak.recruitment.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String requirements;

    private String responsibilities;

    @NotBlank(message = "Location is required")
    @Size(max = 200)
    private String location;

    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    private String subject;

    private Integer minExperienceYears;
    private Integer maxExperienceYears;

    private String qualificationRequired;

    private String employmentType;

    @Min(value = 1, message = "At least 1 position must be available")
    private Integer positionsAvailable;

    @Future(message = "Application deadline must be in the future")
    private LocalDate applicationDeadline;

    private String status;

    private boolean isRemote;

    private Long recruiterId;
}
