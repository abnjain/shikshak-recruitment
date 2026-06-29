package com.shikshak.recruitment.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstituteResponse {

    private Long id;
    private String instituteName;
    private String description;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String website;
    private String phone;
    private Integer establishedYear;
    private String affiliation;
    private String instituteType;
    private String logoUrl;
    private boolean isVerified;
    private Long userId;
    private String userEmail;
    private LocalDateTime createdAt;
}
