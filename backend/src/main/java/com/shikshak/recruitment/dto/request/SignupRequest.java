package com.shikshak.recruitment.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;

    @NotBlank(message = "First name is required")
    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    private String phone;

    @NotEmpty(message = "At least one role is required")
    private Set<String> roles;

    // Institute-specific fields (for ROLE_INSTITUTE)
    private String instituteName;
    private String instituteType;
    private String instituteAddress;
    private String instituteCity;
    private String instituteState;
    private String institutePincode;
    private String instituteWebsite;
    private Integer establishedYear;
    private String affiliation;
}
