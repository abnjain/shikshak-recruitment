package com.shikshak.recruitment.mapper;

import com.shikshak.recruitment.dto.response.ApplicationResponse;
import com.shikshak.recruitment.entity.Application;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {

    @Mapping(target = "jobId", source = "application.job.id")
    @Mapping(target = "jobTitle", source = "application.job.title")
    @Mapping(target = "instituteName", source = "application.job.institute.instituteName")
    @Mapping(target = "candidateId", source = "application.candidate.id")
    @Mapping(target = "candidateName", expression = "java(getCandidateName(application))")
    @Mapping(target = "candidateEmail", source = "application.candidate.email")
    @Mapping(target = "currentStage", expression = "java(application.getCurrentStage() != null ? application.getCurrentStage().getStageName() : null)")
    ApplicationResponse toResponse(Application application);

    default String getCandidateName(Application application) {
        return application.getCandidate().getFirstName() + " " +
               (application.getCandidate().getLastName() != null ? application.getCandidate().getLastName() : "");
    }
}
