package SmartPlacement.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import SmartPlacement.backend.entity.Job;
import SmartPlacement.backend.entity.JobSkill;
import SmartPlacement.backend.entity.Skill;
import SmartPlacement.backend.repository.JobRepository;
import SmartPlacement.backend.repository.JobSkillRepository;
import SmartPlacement.backend.repository.SkillRepository;

@RestController
@RequestMapping("/api/job-skills")
@CrossOrigin(origins = "http://localhost:5174")
public class JobSkillController {

    private final JobSkillRepository jobSkillRepository;
    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;

    public JobSkillController(
            JobSkillRepository jobSkillRepository,
            JobRepository jobRepository,
            SkillRepository skillRepository) {

        this.jobSkillRepository = jobSkillRepository;
        this.jobRepository = jobRepository;
        this.skillRepository = skillRepository;
    }

    // Get all required skills for a job
    @GetMapping("/job/{jobId}")
    public List<JobSkill> getSkillsByJob(@PathVariable Long jobId) {

        return jobSkillRepository.findByJobId(jobId);
    }

    // Add a required skill to a job
    @PostMapping("/job/{jobId}/skill/{skillId}")
    public JobSkill addJobSkill(
            @PathVariable Long jobId,
            @PathVariable Long skillId,
            @RequestParam(defaultValue = "1.0") Double weight) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (jobSkillRepository
                .findByJobIdAndSkillId(jobId, skillId)
                .isPresent()) {

            throw new RuntimeException(
                    "This skill is already required for this job");
        }

        JobSkill jobSkill = new JobSkill();

        jobSkill.setJob(job);
        jobSkill.setSkill(skill);
        jobSkill.setWeight(weight);

        return jobSkillRepository.save(jobSkill);
    }

    // Delete a required skill from a job
    @DeleteMapping("/job/{jobId}/skill/{skillId}")
    public String deleteJobSkill(
            @PathVariable Long jobId,
            @PathVariable Long skillId) {

        JobSkill jobSkill = jobSkillRepository
                .findByJobIdAndSkillId(jobId, skillId)
                .orElseThrow(() ->
                        new RuntimeException("Job skill not found"));

        jobSkillRepository.delete(jobSkill);

        return "Job skill removed successfully";
    }
}