package com.shikshak.recruitment.service;

import com.shikshak.recruitment.common.ResourceNotFoundException;
import com.shikshak.recruitment.dto.response.InstituteResponse;
import com.shikshak.recruitment.entity.Institute;
import com.shikshak.recruitment.mapper.InstituteMapper;
import com.shikshak.recruitment.repository.InstituteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstituteService {

    private final InstituteRepository instituteRepository;
    private final InstituteMapper instituteMapper;

    public InstituteResponse getInstituteById(Long id) {
        Institute institute = instituteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institute", "id", id));
        return instituteMapper.toResponse(institute);
    }

    public InstituteResponse getInstituteByUserId(Long userId) {
        Institute institute = instituteRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Institute", "userId", userId));
        return instituteMapper.toResponse(institute);
    }

    public List<InstituteResponse> getAllInstitutes() {
        return instituteRepository.findAll().stream()
                .map(instituteMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InstituteResponse updateInstitute(Long id, InstituteResponse request) {
        Institute institute = instituteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institute", "id", id));

        if (request.getInstituteName() != null) institute.setInstituteName(request.getInstituteName());
        if (request.getDescription() != null) institute.setDescription(request.getDescription());
        if (request.getAddress() != null) institute.setAddress(request.getAddress());
        if (request.getCity() != null) institute.setCity(request.getCity());
        if (request.getState() != null) institute.setState(request.getState());
        if (request.getPincode() != null) institute.setPincode(request.getPincode());
        if (request.getWebsite() != null) institute.setWebsite(request.getWebsite());
        if (request.getPhone() != null) institute.setPhone(request.getPhone());
        if (request.getEstablishedYear() != null) institute.setEstablishedYear(request.getEstablishedYear());
        if (request.getAffiliation() != null) institute.setAffiliation(request.getAffiliation());
        if (request.getInstituteType() != null) institute.setInstituteType(request.getInstituteType());
        if (request.getLogoUrl() != null) institute.setLogoUrl(request.getLogoUrl());

        institute = instituteRepository.save(institute);
        return instituteMapper.toResponse(institute);
    }

    @Transactional
    public InstituteResponse verifyInstitute(Long id) {
        Institute institute = instituteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institute", "id", id));
        institute.setVerified(true);
        institute = instituteRepository.save(institute);
        return instituteMapper.toResponse(institute);
    }

    public long getVerifiedInstituteCount() {
        return instituteRepository.countByIsVerifiedTrue();
    }

    public Institute getEntityByUserId(Long userId) {
        return instituteRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Institute", "userId", userId));
    }
}
