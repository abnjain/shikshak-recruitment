package com.shikshak.recruitment.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.shikshak.recruitment.common.BadRequestException;
import com.shikshak.recruitment.common.DuplicateResourceException;
import com.shikshak.recruitment.common.ResourceNotFoundException;
import com.shikshak.recruitment.dto.request.GoogleLoginRequest;
import com.shikshak.recruitment.dto.request.LoginRequest;
import com.shikshak.recruitment.dto.request.SignupRequest;
import com.shikshak.recruitment.dto.response.JwtResponse;
import com.shikshak.recruitment.dto.response.UserResponse;
import com.shikshak.recruitment.entity.*;
import com.shikshak.recruitment.enums.ERole;
import com.shikshak.recruitment.mapper.UserMapper;
import com.shikshak.recruitment.repository.*;
import com.shikshak.recruitment.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final InstituteRepository instituteRepository;
    private final CandidateProfileRepository candidateProfileRepository;

    @Value("${app.oauth.google.client-id}")
    private String googleClientId;

    @Transactional
    public JwtResponse googleLogin(GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getCredential());
            if (idToken == null) {
                throw new BadRequestException("Invalid Google credential token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String googleId = payload.getSubject();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");
            String pictureUrl = (String) payload.get("picture");

            // Check if user already exists by email
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                // New user — auto-register with Google
                String username = email.split("@")[0] + "_" + googleId.substring(0, 6);

                // Ensure unique username
                int suffix = 1;
                String baseUsername = username;
                while (userRepository.existsByUsername(username)) {
                    username = baseUsername + suffix;
                    suffix++;
                }

                Set<Role> roles = new HashSet<>();
                ERole targetRole = ERole.ROLE_CANDIDATE;
                if (request.getRole() != null) {
                    try {
                        targetRole = ERole.valueOf("ROLE_" + request.getRole().toUpperCase());
                    } catch (IllegalArgumentException ignored) {
                        // Default to CANDIDATE
                    }
                }
                ERole finalRole = targetRole;
                Role role = roleRepository.findByName(finalRole)
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "name", finalRole.name()));
                roles.add(role);

                user = User.builder()
                        .username(username)
                        .email(email)
                        .password(passwordEncoder.encode(googleId)) // random password
                        .firstName(firstName != null ? firstName : "")
                        .lastName(lastName != null ? lastName : "")
                        .isActive(true)
                        .isEmailVerified(true) // Google emails are pre-verified
                        .profilePictureUrl(pictureUrl != null ? pictureUrl : "")
                        .roles(roles)
                        .build();
                user = userRepository.save(user);

                // Create candidate profile by default
                CandidateProfile profile = CandidateProfile.builder()
                        .fullName((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : ""))
                        .user(user)
                        .build();
                candidateProfileRepository.save(profile);
            }

            // Generate JWT for the user
            String jwt = jwtUtil.generateToken(user.getUsername());

            List<String> roles = user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toList());

            return JwtResponse.builder()
                    .token(jwt)
                    .type("Bearer")
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .roles(roles)
                    .build();
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Google authentication failed: " + e.getMessage());
        }
    }

    @Transactional
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(authentication.getName());

        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "credentials", request.getUsernameOrEmail()));

        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }

    @Transactional
    public UserResponse register(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username '" + request.getUsername() + "' is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already registered");
        }

        Set<Role> roles = new HashSet<>();
        for (String roleName : request.getRoles()) {
            ERole eRole;
            try {
                eRole = ERole.valueOf("ROLE_" + roleName.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid role: " + roleName);
            }
            Role role = roleRepository.findByName(eRole)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName));
            roles.add(role);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .isActive(true)
                .roles(roles)
                .build();

        user = userRepository.save(user);

        // If registering as institute, create institute profile
        if (roles.stream().anyMatch(r -> r.getName() == ERole.ROLE_INSTITUTE)) {
            Institute institute = Institute.builder()
                    .instituteName(request.getInstituteName() != null ? request.getInstituteName() : request.getFirstName() + "'s Institute")
                    .address(request.getInstituteAddress())
                    .city(request.getInstituteCity())
                    .state(request.getInstituteState())
                    .pincode(request.getInstitutePincode())
                    .website(request.getInstituteWebsite())
                    .establishedYear(request.getEstablishedYear())
                    .instituteType(request.getInstituteType())
                    .affiliation(request.getAffiliation())
                    .user(user)
                    .build();
            instituteRepository.save(institute);
        }

        // If registering as candidate, create candidate profile
        if (roles.stream().anyMatch(r -> r.getName() == ERole.ROLE_CANDIDATE)) {
            CandidateProfile profile = CandidateProfile.builder()
                    .fullName(request.getFirstName() + " " + (request.getLastName() != null ? request.getLastName() : ""))
                    .user(user)
                    .build();
            candidateProfileRepository.save(profile);
        }

        return userMapper.toResponse(user);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
