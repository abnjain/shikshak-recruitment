package com.shikshak.recruitment.repository;

import com.shikshak.recruitment.entity.Institute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstituteRepository extends JpaRepository<Institute, Long> {

    Optional<Institute> findByUserId(Long userId);

    Optional<Institute> findByInstituteNameIgnoreCase(String name);

    List<Institute> findByIsVerifiedTrue();

    List<Institute> findByCityContainingIgnoreCase(String city);

    List<Institute> findByInstituteType(String instituteType);

    long countByIsVerifiedTrue();
}
