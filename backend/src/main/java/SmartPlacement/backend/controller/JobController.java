package SmartPlacement.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import SmartPlacement.backend.dto.JobDetailsResponse;
import SmartPlacement.backend.entity.Company;
import SmartPlacement.backend.entity.Job;
import SmartPlacement.backend.entity.User;
import SmartPlacement.backend.entity.UserRole;
import SmartPlacement.backend.repository.CompanyRepository;
import SmartPlacement.backend.repository.JobRepository;
import SmartPlacement.backend.repository.JobSkillRepository;
import SmartPlacement.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5174")
public class JobController {

    private final JobRepository jobRepository;
    private final JobSkillRepository jobSkillRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public JobController(
            JobRepository jobRepository,
            JobSkillRepository jobSkillRepository,
            CompanyRepository companyRepository,
            UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.jobSkillRepository = jobSkillRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // GET ALL JOBS
    // Student + Recruiter
    // =========================================================

    @GetMapping
    public List<JobDetailsResponse> getAllJobs() {

        return jobRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET JOB BY ID
    // Student + Recruiter
    // =========================================================

    @GetMapping("/{id}")
    public JobDetailsResponse getJobById(
            @PathVariable Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Job not found"
                        )
                );

        return convertToResponse(job);
    }

    // =========================================================
    // CREATE JOB
    // Recruiter only
    // =========================================================

    @PostMapping
    public ResponseEntity<?> addJob(
            @RequestBody Job job,
            Authentication authentication) {

        User recruiter = getAuthenticatedRecruiter(authentication);

        if (recruiter == null) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Only recruiters can create jobs");
        }

        Company company = companyRepository
                .findByRecruiterId(recruiter.getId())
                .orElse(null);

        if (company == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Please create your company profile before posting a job");
        }

        // Never trust company ownership information from frontend
        job.setCompany(company);

        // Keep companyName for existing frontend compatibility
        job.setCompanyName(company.getCompanyName());

        if (job.getStatus() == null ||
                job.getStatus().isBlank()) {

            job.setStatus("OPEN");
        }

        Job savedJob = jobRepository.save(job);

        return ResponseEntity.ok(savedJob);
    }

    // =========================================================
    // UPDATE JOB
    // Recruiter only — own jobs only
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(
            @PathVariable Long id,
            @RequestBody Job updatedJob,
            Authentication authentication) {

        User recruiter = getAuthenticatedRecruiter(authentication);

        if (recruiter == null) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Only recruiters can update jobs");
        }

        Job job = jobRepository.findById(id)
                .orElse(null);

        if (job == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (!isJobOwnedByRecruiter(job, recruiter)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You can only update your own jobs");
        }

        job.setJobTitle(updatedJob.getJobTitle());
        job.setLocation(updatedJob.getLocation());
        job.setDescription(updatedJob.getDescription());
        job.setMinimumCgpa(updatedJob.getMinimumCgpa());
        job.setMaximumBacklogs(updatedJob.getMaximumBacklogs());
        job.setMinimumTenthPercentage(
                updatedJob.getMinimumTenthPercentage()
        );
        job.setMinimumTwelfthPercentage(
                updatedJob.getMinimumTwelfthPercentage()
        );

        if (updatedJob.getStatus() != null &&
                !updatedJob.getStatus().isBlank()) {

            job.setStatus(updatedJob.getStatus());
        }

        // Always keep the real company name
        if (job.getCompany() != null) {
            job.setCompanyName(
                    job.getCompany().getCompanyName()
            );
        }

        return ResponseEntity.ok(
                jobRepository.save(job)
        );
    }

    // =========================================================
    // UPDATE JOB STATUS
    // Recruiter only — own jobs only
    // =========================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateJobStatus(
            @PathVariable Long id,
            @RequestBody String status,
            Authentication authentication) {

        User recruiter = getAuthenticatedRecruiter(authentication);

        if (recruiter == null) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Only recruiters can update job status");
        }

        Job job = jobRepository.findById(id)
                .orElse(null);

        if (job == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (!isJobOwnedByRecruiter(job, recruiter)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You can only update your own jobs");
        }

        String newStatus =
                status.replace("\"", "").trim();

        if (!newStatus.equals("OPEN") &&
                !newStatus.equals("CLOSED")) {

            return ResponseEntity
                    .badRequest()
                    .body("Status must be OPEN or CLOSED");
        }

        job.setStatus(newStatus);

        return ResponseEntity.ok(
                jobRepository.save(job)
        );
    }

    // =========================================================
    // DELETE JOB
    // Recruiter only — own jobs only
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(
            @PathVariable Long id,
            Authentication authentication) {

        User recruiter = getAuthenticatedRecruiter(authentication);

        if (recruiter == null) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Only recruiters can delete jobs");
        }

        Job job = jobRepository.findById(id)
                .orElse(null);

        if (job == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (!isJobOwnedByRecruiter(job, recruiter)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You can only delete your own jobs");
        }

        jobRepository.delete(job);

        return ResponseEntity.ok(
                "Job deleted successfully"
        );
    }

    // =========================================================
    // GET AUTHENTICATED RECRUITER
    // =========================================================

    private User getAuthenticatedRecruiter(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return null;
        }

        String email =
                authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null ||
                user.getRole() != UserRole.RECRUITER) {

            return null;
        }

        return user;
    }

    // =========================================================
    // CHECK JOB OWNERSHIP
    // =========================================================

    private boolean isJobOwnedByRecruiter(
            Job job,
            User recruiter) {

        return job.getCompany() != null &&
                job.getCompany()
                        .getRecruiter() != null &&
                job.getCompany()
                        .getRecruiter()
                        .getId()
                        .equals(recruiter.getId());
    }

    // =========================================================
    // CONVERT JOB TO RESPONSE
    // =========================================================

    private JobDetailsResponse convertToResponse(
            Job job) {

        JobDetailsResponse response =
                new JobDetailsResponse();

        response.setId(job.getId());
        response.setCompanyName(job.getCompanyName());
        response.setJobTitle(job.getJobTitle());
        response.setLocation(job.getLocation());
        response.setDescription(job.getDescription());
        response.setMinimumCgpa(job.getMinimumCgpa());
        response.setMaximumBacklogs(
                job.getMaximumBacklogs()
        );
        response.setMinimumTenthPercentage(
                job.getMinimumTenthPercentage()
        );
        response.setMinimumTwelfthPercentage(
                job.getMinimumTwelfthPercentage()
        );
        response.setStatus(job.getStatus());

        
        return response;
    }
}