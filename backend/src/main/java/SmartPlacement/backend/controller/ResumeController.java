package SmartPlacement.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import SmartPlacement.backend.entity.Application;
import SmartPlacement.backend.entity.Student;
import SmartPlacement.backend.entity.User;
import SmartPlacement.backend.entity.UserRole;
import SmartPlacement.backend.repository.ApplicationRepository;
import SmartPlacement.backend.repository.StudentRepository;
import SmartPlacement.backend.repository.UserRepository;
import SmartPlacement.backend.repository.CompanyRepository;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:5174")
public class ResumeController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;
    private final String uploadDirectory = "uploads/resumes/";

    public ResumeController(
            StudentRepository studentRepository,
            UserRepository userRepository,
            ApplicationRepository applicationRepository,
            CompanyRepository companyRepository) {

        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.companyRepository = companyRepository;
    }

    // =========================================================
    // UPLOAD / REPLACE RESUME
    // =========================================================

    @PostMapping("/student/{studentId}")
    public ResponseEntity<String> uploadResume(
            @PathVariable Long studentId,
            @RequestParam("resume") MultipartFile file,
            Authentication authentication)
            throws IOException {

        User user = getAuthenticatedUser(authentication);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("Authentication required");
        }

        if (user.getRole() != UserRole.STUDENT) {
            return ResponseEntity.status(403)
                    .body("Only students can upload resumes");
        }

        Student student = studentRepository.findById(studentId)
                .orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        if (!student.getEmail().equalsIgnoreCase(user.getEmail())) {
            return ResponseEntity.status(403)
                    .body("You can only upload your own resume");
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Please select a resume");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null ||
                !(originalFileName.toLowerCase().endsWith(".pdf")
                || originalFileName.toLowerCase().endsWith(".doc")
                || originalFileName.toLowerCase().endsWith(".docx"))) {

            return ResponseEntity.badRequest()
                    .body("Only PDF, DOC and DOCX files are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body("Resume size must be less than 5 MB");
        }

        Path directory = Paths.get(uploadDirectory);
        Files.createDirectories(directory);

        deleteExistingResume(studentId);

        String safeFileName = Paths.get(originalFileName)
                .getFileName()
                .toString();

        String savedFileName =
                "student_" + studentId + "_" + safeFileName;

        Path filePath = directory.resolve(savedFileName);

        Files.write(filePath, file.getBytes());

        return ResponseEntity.ok("Resume uploaded successfully");
    }

    // =========================================================
    // VIEW RESUME
    // Student: own resume
    // Recruiter: applicant resume
    // =========================================================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> viewResume(
            @PathVariable Long studentId,
            Authentication authentication)
            throws IOException {

        User user = getAuthenticatedUser(authentication);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("Authentication required");
        }

        if (!canAccessResume(studentId, user)) {
            return ResponseEntity.status(403)
                    .body("You are not allowed to access this resume");
        }

        Path resumePath = findResume(studentId);

        if (resumePath == null) {
            return ResponseEntity.status(404)
                    .body("Resume not found for this student");
        }

        byte[] fileBytes = Files.readAllBytes(resumePath);

        MediaType mediaType = getMediaType(resumePath);

        ByteArrayResource resource =
                new ByteArrayResource(fileBytes);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline()
                                .filename(resumePath.getFileName().toString())
                                .build()
                                .toString()
                )
                .contentLength(fileBytes.length)
                .body(resource);
    }

    // =========================================================
    // DOWNLOAD RESUME
    // =========================================================

    @GetMapping("/student/{studentId}/download")
    public ResponseEntity<?> downloadResume(
            @PathVariable Long studentId,
            Authentication authentication)
            throws IOException {

        User user = getAuthenticatedUser(authentication);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("Authentication required");
        }

        if (!canAccessResume(studentId, user)) {
            return ResponseEntity.status(403)
                    .body("You are not allowed to access this resume");
        }

        Path resumePath = findResume(studentId);

        if (resumePath == null) {
            return ResponseEntity.status(404)
                    .body("Resume not found for this student");
        }

        byte[] fileBytes = Files.readAllBytes(resumePath);

        ByteArrayResource resource =
                new ByteArrayResource(fileBytes);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(resumePath.getFileName().toString())
                                .build()
                                .toString()
                )
                .contentLength(fileBytes.length)
                .body(resource);
    }

    // =========================================================
    // DELETE OWN RESUME
    // =========================================================

    @DeleteMapping("/student/{studentId}")
    public ResponseEntity<String> deleteResume(
            @PathVariable Long studentId,
            Authentication authentication)
            throws IOException {

        User user = getAuthenticatedUser(authentication);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("Authentication required");
        }

        if (user.getRole() != UserRole.STUDENT) {
            return ResponseEntity.status(403)
                    .body("Only students can delete resumes");
        }

        Student student = studentRepository.findById(studentId)
                .orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        if (!student.getEmail().equalsIgnoreCase(user.getEmail())) {
            return ResponseEntity.status(403)
                    .body("You can only delete your own resume");
        }

        Path resumePath = findResume(studentId);

        if (resumePath == null) {
            return ResponseEntity.notFound().build();
        }

        Files.delete(resumePath);

        return ResponseEntity.ok("Resume deleted successfully");
    }

    // =========================================================
    // CHECK RESUME ACCESS
    // =========================================================

    private boolean canAccessResume(Long studentId, User user) {

        // Student → only their own resume
        if (user.getRole() == UserRole.STUDENT) {

            return studentRepository.findById(studentId)
                    .map(student ->
                            student.getEmail()
                                    .equalsIgnoreCase(user.getEmail()))
                    .orElse(false);
        }

        // Recruiter → only students who applied to
        // one of that recruiter's jobs
        if (user.getRole() == UserRole.RECRUITER) {

            List<Application> applications =
                    applicationRepository.findByStudentId(studentId);

            for (Application application : applications) {

                if (application.getJob() == null) {
                    continue;
                }

                // New jobs with company relationship
                if (application.getJob().getCompany() != null
                        && application.getJob()
                                .getCompany()
                                .getRecruiter() != null
                        && application.getJob()
                                .getCompany()
                                .getRecruiter()
                                .getId()
                                .equals(user.getId())) {

                    return true;
                }

                // Existing/older jobs
                // where company relationship was not populated
                if (application.getJob().getCompanyName() != null
                        && user.getName() != null
                        && application.getJob()
                                .getCompanyName()
                                .equalsIgnoreCase(user.getName())) {

                    return true;
                }
            }
        }

        return false;
    }

    // =========================================================
    // FIND RESUME FILE
    // =========================================================

    private Path findResume(Long studentId)
            throws IOException {

        Path directory = Paths.get(uploadDirectory);

        if (!Files.exists(directory)) {
            return null;
        }

        String prefix = "student_" + studentId + "_";

        try (Stream<Path> files = Files.list(directory)) {

            return files
                    .filter(Files::isRegularFile)
                    .filter(path ->
                            path.getFileName()
                                    .toString()
                                    .startsWith(prefix))
                    .findFirst()
                    .orElse(null);
        }
    }

    // =========================================================
    // DELETE OLD RESUME
    // =========================================================

    private void deleteExistingResume(Long studentId)
            throws IOException {

        Path existingResume = findResume(studentId);

        if (existingResume != null) {
            Files.deleteIfExists(existingResume);
        }
    }

    // =========================================================
    // GET AUTHENTICATED USER
    // =========================================================

    private User getAuthenticatedUser(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return null;
        }

        return userRepository
                .findByEmail(authentication.getName())
                .orElse(null);
    }

    // =========================================================
    // FILE TYPE
    // =========================================================

    private MediaType getMediaType(Path path) {

        String fileName = path.getFileName()
                .toString()
                .toLowerCase();

        if (fileName.endsWith(".pdf")) {
            return MediaType.APPLICATION_PDF;
        }

        if (fileName.endsWith(".doc")) {
            return MediaType.parseMediaType(
                    "application/msword");
        }

        if (fileName.endsWith(".docx")) {
            return MediaType.parseMediaType(
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        }

        return MediaType.APPLICATION_OCTET_STREAM;
    }
}