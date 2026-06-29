package com.shikshak.recruitment.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeResponse {

    private Long id;
    private String title;
    private String professionalSummary;
    private String education;
    private String experience;
    private String certifications;
    private String achievements;
    private String publications;
    private String projects;
    private String languages;
    private String referencesInfo;
    private String templateId;
    private boolean isPrimary;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
