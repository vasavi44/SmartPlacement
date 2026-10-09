package SmartPlacement.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import SmartPlacement.backend.entity.Company;
import SmartPlacement.backend.repository.CompanyRepository;
import SmartPlacement.backend.dto.LoginRequest;
import SmartPlacement.backend.dto.LoginResponse;
import SmartPlacement.backend.dto.RegisterRequest;
import SmartPlacement.backend.entity.Student;
import SmartPlacement.backend.entity.User;
import SmartPlacement.backend.entity.UserRole;
import SmartPlacement.backend.repository.StudentRepository;
import SmartPlacement.backend.repository.UserRepository;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
        UserRepository userRepository,
        StudentRepository studentRepository,
        CompanyRepository companyRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService) {

        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================
    // REGISTER
    // =========================

    public String register(RegisterRequest request) {

        // Check whether email already exists
        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Create User
        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        // Default role = STUDENT
        UserRole role = request.getRole();

        if (role == null) {
            role = UserRole.STUDENT;
        }

        user.setRole(role);

        // Save user
        User savedUser = userRepository.save(user);

        // =========================
        // CREATE STUDENT PROFILE
        // =========================

        if (role == UserRole.STUDENT) {

            Student student = new Student();

            student.setName(request.getName());
            student.setEmail(request.getEmail());

            // Default values
            student.setPhone("");
            student.setCgpa(0.0);
            student.setTenthPercentage(0.0);
            student.setTwelfthPercentage(0.0);
            student.setBacklogs(0);

            studentRepository.save(student);
        }
if (role == UserRole.RECRUITER) {

    Company company = new Company();

    company.setCompanyName(
            savedUser.getName()
    );

    company.setIndustry("");
    company.setLocation("");
    company.setDescription("");
    company.setWebsite("");

    company.setRecruiter(savedUser);

    companyRepository.save(company);
}
        return "User registered successfully";
    }

    // =========================
    // LOGIN
    // =========================

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(
                        () -> new RuntimeException(
                                "Invalid email or password"
                        )
                );

        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        // Generate JWT
        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        LoginResponse response =
                new LoginResponse();

        response.setToken(token);
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        return response;
    }
}