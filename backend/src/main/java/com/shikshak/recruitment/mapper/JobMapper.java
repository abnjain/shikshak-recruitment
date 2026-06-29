package com.shikshak.recruitment.mapper;

import com.shikshak.recruitment.dto.response.JobResponse;
import com.shikshak.recruitment.entity.Job;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JobMapper {

    @Mapping(target = "instituteId", source = "job.institute.id")
    @Mapping(target = "instituteName", source = "job.institute.instituteName")
    @Mapping(target = "recruiterId", source = "job.recruiter.id")
    @Mapping(target = "recruiterName", expression = "java(getRecruiterName(job))")
    @Mapping(target = "applicationCount", expression = "java(job.getApplications() != null ? (long) job.getApplications().size() : 0L)")
    JobResponse toResponse(Job job);

    default String getRecruiterName(Job job) {
        if (job.getRecruiter() != null) {
            return job.getRecruiter().getFirstName() + " " +
                   (job.getRecruiter().getLastName() != null ? job.getRecruiter().getLastName() : "");
        }
        return null;
    }
}
