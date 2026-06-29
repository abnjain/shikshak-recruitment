package com.shikshak.recruitment.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeRequest {

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
}
