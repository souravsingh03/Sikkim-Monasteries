package com.mediresponse.service;

import com.mediresponse.dto.LoginRequest;
import com.mediresponse.dto.LoginResponse;
import com.mediresponse.model.User;
import com.mediresponse.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse authenticate(LoginRequest request) {
        LoginResponse response = new LoginResponse();

        Optional<User> userOpt = userRepository.findByEmployeeId(request.getEmployeeId().toUpperCase());

        if (userOpt.isEmpty()) {
            response.setSuccess(false);
            response.setError("Employee ID not found in system.");
            return response;
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            response.setSuccess(false);
            response.setError("Incorrect password. Please try again.");
            return response;
        }

        String token = jwtService.generateToken(user.getEmployeeId());

        response.setSuccess(true);
        response.setToken(token);
        response.setName(user.getName());
        response.setRole(user.getRole().name());
        response.setEmployeeId(user.getEmployeeId());
        response.setDepartment(user.getDepartment());
        return response;
    }
}
