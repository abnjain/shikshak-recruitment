package com.shikshak.recruitment.controller;

import com.shikshak.recruitment.common.ApiResponse;
import com.shikshak.recruitment.dto.request.GoogleLoginRequest;
import com.shikshak.recruitment.dto.request.LoginRequest;
import com.shikshak.recruitment.dto.request.SignupRequest;
import com.shikshak.recruitment.dto.response.JwtResponse;
import com.shikshak.recruitment.dto.response.UserResponse;
import com.shikshak.recruitment.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${app.jwt.refresh-expiration-ms}")
    private int refreshExpirationMs;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request,
                                                          HttpServletResponse httpResponse) {
        JwtResponse response = authService.login(request);
        setRefreshTokenCookie(httpResponse, response.getRefreshToken());
        return ApiResponse.ok("Login successful", response);
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<JwtResponse>> googleLogin(@Valid @RequestBody GoogleLoginRequest request,
                                                                HttpServletResponse httpResponse) {
        JwtResponse response = authService.googleLogin(request);
        setRefreshTokenCookie(httpResponse, response.getRefreshToken());
        return ApiResponse.ok("Google login successful", response);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody SignupRequest request) {
        UserResponse response = authService.register(request);
        return ApiResponse.created(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<JwtResponse>> refresh(@CookieValue(value = "refreshToken", required = false) String refreshToken,
                                                            HttpServletResponse httpResponse) {
        JwtResponse response = authService.refreshAccessToken(refreshToken);
        setRefreshTokenCookie(httpResponse, response.getRefreshToken());
        return ApiResponse.ok("Token refreshed successfully", response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse httpResponse) {
        clearRefreshTokenCookie(httpResponse);
        return ApiResponse.ok("Logged out successfully", null);
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

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // true in production with HTTPS
        cookie.setPath("/api/v1/auth");
        cookie.setMaxAge((int) (refreshExpirationMs / 1000));
        cookie.setAttribute("SameSite", "Lax");
        response.addCookie(cookie);
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/api/v1/auth");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Lax");
        response.addCookie(cookie);
    }
}
