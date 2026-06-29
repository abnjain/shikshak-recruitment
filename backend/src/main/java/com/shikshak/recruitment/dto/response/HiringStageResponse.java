package com.shikshak.recruitment.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HiringStageResponse {

    private Long id;
    private String stageName;
    private Integer stageOrder;
    private String description;
    private boolean isActive;
    private Long jobId;
    private long candidateCount;
    private LocalDateTime createdAt;
}
