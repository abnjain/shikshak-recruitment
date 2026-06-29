package com.shikshak.recruitment.mapper;

import com.shikshak.recruitment.dto.response.InstituteResponse;
import com.shikshak.recruitment.entity.Institute;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InstituteMapper {

    @Mapping(target = "userId", source = "institute.user.id")
    @Mapping(target = "userEmail", source = "institute.user.email")
    InstituteResponse toResponse(Institute institute);
}
