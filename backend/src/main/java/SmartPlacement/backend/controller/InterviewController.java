package SmartPlacement.backend.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import SmartPlacement.backend.entity.Application;
import SmartPlacement.backend.entity.Interview;
import SmartPlacement.backend.entity.InterviewStatus;
import SmartPlacement.backend.repository.ApplicationRepository;
import SmartPlacement.backend.repository.InterviewRepository;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "http://localhost:5174")
public class InterviewController {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;

    public InterviewController(
            InterviewRepository interviewRepository,
            ApplicationRepository applicationRepository) {

        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
    }

    // Schedule an interview
    @PostMapping("/application/{applicationId}")
    public Interview scheduleInterview(
            @PathVariable Long applicationId,
            @RequestParam String date,
            @RequestParam String time,
            @RequestParam String mode,
            @RequestParam String location) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"));

        // Prevent duplicate interview scheduling
        if (interviewRepository
                .findByApplicationId(applicationId)
                .isPresent()) {

            throw new RuntimeException(
                    "An interview is already scheduled for this application");
        }

        Interview interview = new Interview();

        interview.setApplication(application);
        interview.setInterviewDate(
                LocalDate.parse(date));
        interview.setInterviewTime(
                LocalTime.parse(time));
        interview.setMode(mode);
        interview.setLocation(location);
        interview.setStatus(
                InterviewStatus.SCHEDULED);
        interview.setResult("Pending");

        return interviewRepository.save(interview);
    }

    // Get all interviews
    @GetMapping
    public List<Interview> getAllInterviews() {

        return interviewRepository.findAll();
    }

    // Get interviews of a student
    @GetMapping("/student/{studentId}")
    public List<Interview> getStudentInterviews(
            @PathVariable Long studentId) {

        return interviewRepository
                .findByApplicationStudentId(studentId);
    }

    // Get interviews for a job
    @GetMapping("/job/{jobId}")
    public List<Interview> getJobInterviews(
            @PathVariable Long jobId) {

        return interviewRepository
                .findByApplicationJobId(jobId);
    }

    // Get interviews by status
    @GetMapping("/status/{status}")
    public List<Interview> getInterviewsByStatus(
            @PathVariable InterviewStatus status) {

        return interviewRepository
                .findByStatus(status);
    }

    // Update interview status
    @PutMapping("/{interviewId}/status")
    public Interview updateInterviewStatus(
            @PathVariable Long interviewId,
            @RequestParam InterviewStatus status) {

        Interview interview =
                interviewRepository.findById(interviewId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Interview not found"));

        interview.setStatus(status);

        return interviewRepository.save(interview);
    }

    // Update interview result
    @PutMapping("/{interviewId}/result")
    public Interview updateInterviewResult(
            @PathVariable Long interviewId,
            @RequestParam String result) {

        Interview interview =
                interviewRepository.findById(interviewId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Interview not found"));

        interview.setResult(result);

        return interviewRepository.save(interview);
    }
}