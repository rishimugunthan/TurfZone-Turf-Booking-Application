package com.turfzone.service;

import com.turfzone.dto.*;
import com.turfzone.exception.*;
import com.turfzone.model.User;
import com.turfzone.repository.UserRepository;
import com.turfzone.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getEmail());

        String token = jwtUtil.generateToken(savedUser.getEmail());

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                savedUser.getId(), savedUser.getFullName(), savedUser.getEmail()
        );

        return new AuthResponse(token, userInfo);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid email or password.");
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Authentication failed: " + e.getMessage());
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("User not found."));

        log.info("User logged in: {}", user.getEmail());

        String token = jwtUtil.generateToken(user.getEmail());

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                user.getId(), user.getFullName(), user.getEmail()
        );

        return new AuthResponse(token, userInfo);
    }

    public AuthResponse.UserInfo getMe(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new AuthResponse.UserInfo(user.getId(), user.getFullName(), user.getEmail());
    }
}
