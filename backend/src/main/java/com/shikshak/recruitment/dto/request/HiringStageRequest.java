package com.shikshak.recruitment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HiringStageRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotBlank(message = "Stage name is required")
    private String stageName;

    @NotNull(message = "Stage order is required")
    private Integer stageOrder;

    private String description;
}
