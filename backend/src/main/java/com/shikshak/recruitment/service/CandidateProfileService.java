package com.shikshak.recruitment.service;

import com.shikshak.recruitment.common.ResourceNotFoundException;
import com.shikshak.recruitment.dto.request.ProfileUpdateRequest;
import com.shikshak.recruitment.dto.response.CandidateProfileResponse;
import com.shikshak.recruitment.entity.CandidateProfile;
import com.shikshak.recruitment.entity.User;
import com.shikshak.recruitment.enums.Gender;
import com.shikshak.recruitment.mapper.CandidateProfileMapper;
import com.shikshak.recruitment.repository.CandidateProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CandidateProfileService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final CandidateProfileMapper profileMapper;
    private final UserService userService;

    public CandidateProfileResponse getProfileByUserId(Long userId) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("CandidateProfile", "userId", userId));
        return profileMapper.toResponse(profile);
    }

    @Transactional
    public CandidateProfileResponse createOrUpdateProfile(Long userId, ProfileUpdateRequest request) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElse(CandidateProfile.builder()
                        .user(User.builder().id(userId).build())
                        .build());

        if (request.getFullName() != null) profile.setFullName(request.getFullName());
        if (request.getGender() != null) {
            try {
                profile.setGender(Gender.valueOf(request.getGender().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }
        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getAddress() != null) profile.setAddress(request.getAddress());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getState() != null) profile.setState(request.getState());
        if (request.getPincode() != null) profile.setPincode(request.getPincode());
        if (request.getHighestQualification() != null) profile.setHighestQualification(request.getHighestQualification());
        if (request.getSpecialization() != null) profile.setSpecialization(request.getSpecialization());
        if (request.getTotalExperienceYears() != null) profile.setTotalExperienceYears(request.getTotalExperienceYears());
        if (request.getSkills() != null) profile.setSkills(request.getSkills());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getCurrentEmployer() != null) profile.setCurrentEmployer(request.getCurrentEmployer());
        if (request.getCurrentPosition() != null) profile.setCurrentPosition(request.getCurrentPosition());
        if (request.getPreferredSubjects() != null) profile.setPreferredSubjects(request.getPreferredSubjects());
        if (request.getPreferredLocations() != null) profile.setPreferredLocations(request.getPreferredLocations());
        if (request.getExpectedSalaryMin() != null) profile.setExpectedSalaryMin(request.getExpectedSalaryMin());
        if (request.getExpectedSalaryMax() != null) profile.setExpectedSalaryMax(request.getExpectedSalaryMax());
        profile.setOpenToRelocate(request.isOpenToRelocate());

        profile = candidateProfileRepository.save(profile);
        return profileMapper.toResponse(profile);
    }
}
