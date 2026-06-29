package com.shikshak.recruitment.mapper;

import com.shikshak.recruitment.dto.response.HiringStageResponse;
import com.shikshak.recruitment.entity.HiringStage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface HiringStageMapper {

    @Mapping(target = "jobId", source = "stage.job.id")
    @Mapping(target = "candidateCount", expression = "java(stage.getApplications() != null ? (long) stage.getApplications().size() : 0L)")
    HiringStageResponse toResponse(HiringStage stage);
}
