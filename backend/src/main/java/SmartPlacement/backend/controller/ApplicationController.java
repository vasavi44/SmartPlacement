package SmartPlacement.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import SmartPlacement.backend.entity.Application;
import SmartPlacement.backend.entity.ApplicationStatus;
import SmartPlacement.backend.entity.Job;
import SmartPlacement.backend.entity.Student;
import SmartPlacement.backend.repository.ApplicationRepository;
import SmartPlacement.backend.repository.JobRepository;
import SmartPlacement.backend.repository.StudentRepository;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5174")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    public ApplicationController(
            ApplicationRepository applicationRepository,
            StudentRepository studentRepository,
            JobRepository jobRepository) {

        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }

    // =========================================================
    // STUDENT APPLIES FOR A JOB
    // =========================================================

    @PostMapping("/student/{studentId}/job/{jobId}")
    public ResponseEntity<?> applyForJob(
            @PathVariable Long studentId,
            @PathVariable Long jobId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));
        if ("CLOSED".equalsIgnoreCase(job.getStatus())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "This job is currently closed for applications"
                    ));
        }
        // Prevent duplicate applications
        List<Application> existingApplications =
                applicationRepository.findByStudentId(studentId);

        boolean alreadyApplied =
                existingApplications.stream()
                        .anyMatch(application ->
                                application.getJob() != null &&
                                application.getJob().getId() != null &&
                                application.getJob().getId().equals(jobId)
                        );
       if ("CLOSED".equalsIgnoreCase(job.getStatus())) {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(Map.of("message", "This job is closed and no longer accepting applications"));
}

        if (alreadyApplied) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            "You have already applied for this job"
                    ));
        }

        Application application = new Application();

        application.setStudent(student);
        application.setJob(job);
        application.setApplicationDate(
                LocalDateTime.now()
        );
        application.setStatus(
                ApplicationStatus.APPLIED
        );

        return ResponseEntity.ok(
                applicationRepository.save(application)
        );
    }

    // =========================================================
    // GET ALL APPLICATIONS
    // =========================================================

    @GetMapping
    public List<Application> getAllApplications() {

        return applicationRepository.findAll();
    }

    // =========================================================
    // GET STUDENT APPLICATIONS
    // =========================================================

    @GetMapping("/student/{studentId}")
    public List<Application> getStudentApplications(
            @PathVariable Long studentId) {

        return applicationRepository.findByStudentId(
                studentId
        );
    }

    // =========================================================
    // GET APPLICANTS FOR A JOB
    // =========================================================

    @GetMapping("/job/{jobId}")
    public List<Application> getJobApplications(
            @PathVariable Long jobId) {

        return applicationRepository.findByJobId(
                jobId
        );
    }

    // =========================================================
    // GET APPLICATIONS BY STATUS
    // =========================================================

    @GetMapping("/status/{status}")
    public List<Application> getApplicationsByStatus(
            @PathVariable ApplicationStatus status) {

        return applicationRepository.findByStatus(
                status
        );
    }

    // =========================================================
    // UPDATE APPLICATION STATUS
    // =========================================================

    @PutMapping("/{applicationId}/status")
    public Application updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status) {

        Application application =
                applicationRepository.findById(
                        applicationId
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found"
                        )
                );

        application.setStatus(status);

        return applicationRepository.save(
                application
        );
    }
}