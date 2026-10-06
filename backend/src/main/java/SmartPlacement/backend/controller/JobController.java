package SmartPlacement.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

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
import SmartPlacement.backend.entity.Job;
import SmartPlacement.backend.entity.JobSkill;
import SmartPlacement.backend.repository.JobRepository;
import SmartPlacement.backend.repository.JobSkillRepository;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5174")
public class JobController {

    private final JobRepository jobRepository;
    private final JobSkillRepository jobSkillRepository;

    public JobController(
            JobRepository jobRepository,
            JobSkillRepository jobSkillRepository) {

        this.jobRepository = jobRepository;
        this.jobSkillRepository = jobSkillRepository;
    }

    // Create a new job
    @PostMapping
public Job addJob(@RequestBody Job job) {
    if (job.getStatus() == null || job.getStatus().isBlank()) {
        job.setStatus("OPEN");
    }

    return jobRepository.save(job);
}

    // Get all jobs with their required skills
    @GetMapping
    public List<JobDetailsResponse> getAllJobs() {

        return jobRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get one job with its required skills
    @GetMapping("/{id}")
    public JobDetailsResponse getJobById(@PathVariable Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        return convertToResponse(job);
    }

    // Update job
    @PutMapping("/{id}")
    public Job updateJob(
            @PathVariable Long id,
            @RequestBody Job updatedJob) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        job.setCompanyName(updatedJob.getCompanyName());
        job.setJobTitle(updatedJob.getJobTitle());
        job.setLocation(updatedJob.getLocation());
        job.setDescription(updatedJob.getDescription());
        job.setMinimumCgpa(updatedJob.getMinimumCgpa());
        job.setMaximumBacklogs(updatedJob.getMaximumBacklogs());
        job.setMinimumTenthPercentage(
                updatedJob.getMinimumTenthPercentage());
                job.setMinimumTwelfthPercentage(
                updatedJob.getMinimumTwelfthPercentage());

        if (updatedJob.getStatus() != null) {
            job.setStatus(updatedJob.getStatus());
        }

        return jobRepository.save(job);
    }
    // Open or close a job
    @PutMapping("/{id}/status")
    public Job updateJobStatus(
            @PathVariable Long id,
            @RequestBody String status) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        String newStatus = status.replace("\"", "").trim();

        if (!newStatus.equals("OPEN") &&
            !newStatus.equals("CLOSED")) {
            throw new RuntimeException(
                    "Status must be OPEN or CLOSED");
        }

        job.setStatus(newStatus);

        return jobRepository.save(job);
    }
    // Delete job
    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id) {

        jobRepository.deleteById(id);

        return "Job deleted successfully";
    }

    // Convert Job entity into response containing required skill names
    private JobDetailsResponse convertToResponse(Job job) {

        JobDetailsResponse response = new JobDetailsResponse();

        response.setId(job.getId());
        response.setCompanyName(job.getCompanyName());
        response.setJobTitle(job.getJobTitle());
        response.setLocation(job.getLocation());
        response.setDescription(job.getDescription());

        response.setMinimumCgpa(job.getMinimumCgpa());
        response.setMaximumBacklogs(job.getMaximumBacklogs());
        response.setMinimumTenthPercentage(
                job.getMinimumTenthPercentage());
        response.setMinimumTwelfthPercentage(
                job.getMinimumTwelfthPercentage());
                response.setStatus(job.getStatus());

        List<JobSkill> jobSkills =
                jobSkillRepository.findByJobId(job.getId());

        List<String> skillNames = jobSkills.stream()
                .map(jobSkill -> jobSkill.getSkill().getName())
                .collect(Collectors.toList());

        response.setSkills(skillNames);

        return response;
    }
}