package com.shikshak.recruitment.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private String instituteName;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String status;
    private String coverLetter;
    private String resumeUrl;
    private String additionalDocumentsUrl;
    private String recruiterNotes;
    private String feedback;
    private String currentStage;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
