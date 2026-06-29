package com.shikshak.recruitment.service;

import com.shikshak.recruitment.common.ResourceNotFoundException;
import com.shikshak.recruitment.dto.request.ResumeRequest;
import com.shikshak.recruitment.dto.response.ResumeResponse;
import com.shikshak.recruitment.entity.Resume;
import com.shikshak.recruitment.entity.User;
import com.shikshak.recruitment.mapper.ResumeMapper;
import com.shikshak.recruitment.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final ResumeMapper resumeMapper;
    private final UserService userService;

    public List<ResumeResponse> getResumesByUserId(Long userId) {
        return resumeRepository.findByUserId(userId).stream()
                .map(resumeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ResumeResponse getResumeById(Long id, Long userId) {
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", id));
        return resumeMapper.toResponse(resume);
    }

    @Transactional
    public ResumeResponse createResume(ResumeRequest request, Long userId) {
        // If setting as primary, unset other primaries
        if (request.isPrimary()) {
            resumeRepository.findByUserIdAndIsPrimaryTrue(userId)
                    .ifPresent(existing -> {
                        existing.setPrimary(false);
                        resumeRepository.save(existing);
                    });
        }

        Resume resume = Resume.builder()
                .title(request.getTitle())
                .professionalSummary(request.getProfessionalSummary())
                .education(request.getEducation())
                .experience(request.getExperience())
                .certifications(request.getCertifications())
                .achievements(request.getAchievements())
                .publications(request.getPublications())
                .projects(request.getProjects())
                .languages(request.getLanguages())
                .referencesInfo(request.getReferencesInfo())
                .templateId(request.getTemplateId() != null ? request.getTemplateId() : "modern")
                .isPrimary(request.isPrimary())
                .user(User.builder().id(userId).build())
                .build();

        resume = resumeRepository.save(resume);
        return resumeMapper.toResponse(resume);
    }

    @Transactional
    public ResumeResponse updateResume(Long id, ResumeRequest request, Long userId) {
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", id));

        if (request.isPrimary() && !resume.isPrimary()) {
            resumeRepository.findByUserIdAndIsPrimaryTrue(userId)
                    .ifPresent(existing -> {
                        existing.setPrimary(false);
                        resumeRepository.save(existing);
                    });
        }

        if (request.getTitle() != null) resume.setTitle(request.getTitle());
        if (request.getProfessionalSummary() != null) resume.setProfessionalSummary(request.getProfessionalSummary());
        if (request.getEducation() != null) resume.setEducation(request.getEducation());
        if (request.getExperience() != null) resume.setExperience(request.getExperience());
        if (request.getCertifications() != null) resume.setCertifications(request.getCertifications());
        if (request.getAchievements() != null) resume.setAchievements(request.getAchievements());
        if (request.getPublications() != null) resume.setPublications(request.getPublications());
        if (request.getProjects() != null) resume.setProjects(request.getProjects());
        if (request.getLanguages() != null) resume.setLanguages(request.getLanguages());
        if (request.getReferencesInfo() != null) resume.setReferencesInfo(request.getReferencesInfo());
        if (request.getTemplateId() != null) resume.setTemplateId(request.getTemplateId());
        resume.setPrimary(request.isPrimary());

        resume = resumeRepository.save(resume);
        return resumeMapper.toResponse(resume);
    }

    @Transactional
    public void deleteResume(Long id, Long userId) {
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", "id", id));
        resumeRepository.delete(resume);
    }
}
