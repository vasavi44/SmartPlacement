package SmartPlacement.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5174")
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(
                    corsConfigurationSource()
            ))

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .authorizeHttpRequests(auth -> auth

                // PUBLIC AUTHENTICATION ENDPOINTS
                .requestMatchers(
                        HttpMethod.POST,
                        "/api/auth/login",
                        "/api/auth/register"
                ).permitAll()

                // PUBLIC OPTIONS
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll()

                // STUDENT + RECRUITER JOB VIEWING
                .requestMatchers(
                        HttpMethod.GET,
                        "/api/jobs",
                        "/api/jobs/**"
                ).hasAnyRole("STUDENT", "RECRUITER")

                // RECRUITER JOB MANAGEMENT
                .requestMatchers(
                        HttpMethod.POST,
                        "/api/jobs"
                ).hasRole("RECRUITER")

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/jobs/**"
                ).hasRole("RECRUITER")

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/jobs/**"
                ).hasRole("RECRUITER")

                // INTERVIEWS
                .requestMatchers(
                        "/api/interviews/student/**"
                ).hasRole("STUDENT")

                .requestMatchers(
                        "/api/interviews",
                        "/api/interviews/application/**",
                        "/api/interviews/job/**",
                        "/api/interviews/status/**",
                        "/api/interviews/*/status",
                        "/api/interviews/*/result"
                ).hasRole("RECRUITER")

                // APPLICATIONS
                .requestMatchers(
                        "/api/applications/**"
                ).hasAnyRole("STUDENT", "RECRUITER")

                // SKILLS
                .requestMatchers(
                        "/api/skills/**"
                ).hasAnyRole("STUDENT", "RECRUITER")

                // EVERYTHING ELSE
                .requestMatchers("/api/**")
                .authenticated()

                .anyRequest()
                .authenticated()
            )

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}