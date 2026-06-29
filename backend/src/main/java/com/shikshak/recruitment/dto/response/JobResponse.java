package com.shikshak.recruitment.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String responsibilities;
    private String location;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String subject;
    private Integer minExperienceYears;
    private Integer maxExperienceYears;
    private String qualificationRequired;
    private String employmentType;
    private Integer positionsAvailable;
    private LocalDate applicationDeadline;
    private String status;
    private boolean isRemote;
    private Long instituteId;
    private String instituteName;
    private Long recruiterId;
    private String recruiterName;
    private long applicationCount;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
}
