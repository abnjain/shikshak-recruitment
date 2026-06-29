package com.shikshak.recruitment.mapper;

import com.shikshak.recruitment.dto.response.ResumeResponse;
import com.shikshak.recruitment.entity.Resume;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ResumeMapper {

    @Mapping(target = "userId", source = "resume.user.id")
    ResumeResponse toResponse(Resume resume);
}
