package com.shikshak.recruitment.repository;

import com.shikshak.recruitment.entity.HiringStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HiringStageRepository extends JpaRepository<HiringStage, Long> {

    List<HiringStage> findByJobIdOrderByStageOrderAsc(Long jobId);

    List<HiringStage> findByJobIdAndIsActiveTrueOrderByStageOrderAsc(Long jobId);
}
