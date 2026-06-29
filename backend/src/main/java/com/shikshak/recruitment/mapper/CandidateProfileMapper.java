package com.shikshak.recruitment.mapper;

import com.shikshak.recruitment.dto.response.CandidateProfileResponse;
import com.shikshak.recruitment.entity.CandidateProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CandidateProfileMapper {

    @Mapping(target = "userId", source = "profile.user.id")
    @Mapping(target = "userEmail", source = "profile.user.email")
    @Mapping(target = "username", source = "profile.user.username")
    CandidateProfileResponse toResponse(CandidateProfile profile);
}
