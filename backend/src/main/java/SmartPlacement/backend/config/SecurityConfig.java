package SmartPlacement.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import SmartPlacement.backend.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5174")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> {})

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Login and registration are public
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()
// ==============================
// INTERVIEW ACCESS
// ==============================

// Students can view their own interviews
.requestMatchers(
        "/api/interviews/student/**"
).hasRole("STUDENT")

// Recruiters and admins can manage recruiter-side interviews
.requestMatchers(
        "/api/interviews",
        "/api/interviews/application/**",
        "/api/interviews/job/**",
        "/api/interviews/status/**",
        "/api/interviews/*/status",
        "/api/interviews/*/result"
).hasAnyRole(
        "RECRUITER",
        "ADMIN"
)
                        
                        // ==============================
                        // APPLICATIONS
                        // ==============================

                        .requestMatchers(
                                "/api/applications/**"
                        ).hasAnyRole(
                                "STUDENT",
                                "RECRUITER",
                                "ADMIN"
                        )
                        // Skills can be viewed by logged-in users
.requestMatchers(
        "/api/skills/**"
)
.hasAnyRole(
        "STUDENT",
        "RECRUITER",
        "ADMIN"
)
                        // ==============================
                        // OTHER APIs
                        // ==============================

                        .requestMatchers(
                                "/api/**"
                        ).authenticated()

                        .anyRequest().authenticated()
                )

                // JWT authentication filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}