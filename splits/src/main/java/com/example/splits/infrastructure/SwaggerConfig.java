package com.example.splits.infrastructure;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Splits API",
                description = "Dokumentacja API do zarządzania grupami i wydatkami",
                version = "1.0"
        ),
        security = {
                @SecurityRequirement(name = "bearerAuth") // Wymusza kłódeczkę na wszystkich endpointach
        }
)
@SecurityScheme(
        name = "bearerAuth",
        description = "Wklej tutaj swój token JWT (bez słowa Bearer)",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class SwaggerConfig {
}