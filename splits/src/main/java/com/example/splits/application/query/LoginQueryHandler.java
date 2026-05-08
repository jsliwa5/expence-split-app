package com.example.splits.application.query;

import com.example.splits.application.dto.AuthResponse;
import com.example.splits.infrastructure.security.CustomUserDetailsService;
import com.example.splits.infrastructure.security.JwtService;
import com.example.splits.shared.cqrs.QueryHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginQueryHandler implements QueryHandler<LoginQuery, AuthResponse> {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Override
    public AuthResponse handle(LoginQuery query) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(query.email(), query.password())
        );

        var userDetails = userDetailsService.loadUserByUsername(query.email());

        var jwtToken = jwtService.generateToken(userDetails);

        return new AuthResponse(jwtToken);
    }
}
