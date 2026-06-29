package com.shikshak.recruitment.controller;

import com.shikshak.recruitment.common.ApiResponse;
import com.shikshak.recruitment.dto.request.GoogleLoginRequest;
import com.shikshak.recruitment.dto.request.LoginRequest;
import com.shikshak.recruitment.dto.request.SignupRequest;
import com.shikshak.recruitment.dto.response.JwtResponse;
import com.shikshak.recruitment.dto.response.UserResponse;
import com.shikshak.recruitment.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse response = authService.login(request);
        return ApiResponse.ok("Login successful", response);
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<JwtResponse>> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        JwtResponse response = authService.googleLogin(request);
        return ApiResponse.ok("Google login successful", response);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody SignupRequest request) {
        UserResponse response = authService.register(request);
        return ApiResponse.created(response);
    }

    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkUsername(@RequestParam String username) {
        boolean exists = authService.existsByUsername(username);
        return ApiResponse.ok(Map.of("exists", exists));
    }

    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkEmail(@RequestParam String email) {
        boolean exists = authService.existsByEmail(email);
        return ApiResponse.ok(Map.of("exists", exists));
    }
}
