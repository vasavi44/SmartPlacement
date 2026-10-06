package SmartPlacement.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import SmartPlacement.backend.dto.MatchingResponse;
import SmartPlacement.backend.entity.Job;
import SmartPlacement.backend.entity.JobSkill;
import SmartPlacement.backend.entity.Student;
import SmartPlacement.backend.entity.StudentSkill;
import SmartPlacement.backend.repository.JobRepository;
import SmartPlacement.backend.repository.JobSkillRepository;
import SmartPlacement.backend.repository.StudentRepository;
import SmartPlacement.backend.repository.StudentSkillRepository;

@Service
public class MatchingService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final JobSkillRepository jobSkillRepository;

    public MatchingService(
            StudentRepository studentRepository,
            JobRepository jobRepository,
            StudentSkillRepository studentSkillRepository,
            JobSkillRepository jobSkillRepository) {

        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.jobSkillRepository = jobSkillRepository;
    }

    public MatchingResponse calculateMatch(Long studentId, Long jobId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        List<StudentSkill> studentSkills =
                studentSkillRepository.findByStudentId(studentId);

        List<JobSkill> jobSkills =
                jobSkillRepository.findByJobId(jobId);

        double totalSkillWeight = 0;
        double matchedSkillWeight = 0;

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        // Compare student skills with job-required skills
        for (JobSkill jobSkill : jobSkills) {

            totalSkillWeight += jobSkill.getWeight();

            boolean skillMatched = false;

            for (StudentSkill studentSkill : studentSkills) {

                if (studentSkill.getSkill().getId()
                        .equals(jobSkill.getSkill().getId())) {

                    matchedSkillWeight += jobSkill.getWeight();

                    matchedSkills.add(
                            jobSkill.getSkill().getName()
                    );

                    skillMatched = true;
                    break;
                }
            }

            if (!skillMatched) {
                missingSkills.add(
                        jobSkill.getSkill().getName()
                );
            }
        }

        // Calculate skill match percentage
        double skillMatchPercentage = 0;

        if (totalSkillWeight > 0) {
            skillMatchPercentage =
                    (matchedSkillWeight / totalSkillWeight) * 100;
        }

        // Convert 10th score from 10-point scale to percentage
        double tenthPercentage = student.getTenthPercentage();

        if (tenthPercentage <= 10) {
            tenthPercentage = tenthPercentage * 10;
        }

        // Calculate academic score
        double academicScore =
                calculateAcademicScore(
                        student,
                        job,
                        tenthPercentage
                );

        // Calculate eligibility
        boolean eligible =
                student.getCgpa() >= job.getMinimumCgpa()
                && student.getBacklogs() <= job.getMaximumBacklogs()
                && tenthPercentage >= job.getMinimumTenthPercentage()
                && student.getTwelfthPercentage()
                        >= job.getMinimumTwelfthPercentage();

        // Overall score
        double overallMatchPercentage =
                (skillMatchPercentage * 0.75)
                + (academicScore * 0.25);

        // Create response
        MatchingResponse response = new MatchingResponse();

        response.setStudentId(student.getId());
        response.setJobId(job.getId());

        response.setStudentName(student.getName());
        response.setJobTitle(job.getJobTitle());
        response.setCompanyName(job.getCompanyName());

        response.setSkillMatchPercentage(skillMatchPercentage);
        response.setAcademicScore(academicScore);
        response.setOverallMatchPercentage(overallMatchPercentage);

        response.setMatchedSkills(matchedSkills);
        response.setMissingSkills(missingSkills);
        response.setEligible(eligible);

        return response;
    }

    private double calculateAcademicScore(
            Student student,
            Job job,
            double tenthPercentage) {

        int totalCriteria = 4;
        int matchedCriteria = 0;

        // CGPA
        if (student.getCgpa() >= job.getMinimumCgpa()) {
            matchedCriteria++;
        }

        // Backlogs
        if (student.getBacklogs() <= job.getMaximumBacklogs()) {
            matchedCriteria++;
        }

        // 10th percentage
        if (tenthPercentage >= job.getMinimumTenthPercentage()) {
            matchedCriteria++;
        }

        // 12th percentage
        if (student.getTwelfthPercentage()
                >= job.getMinimumTwelfthPercentage()) {

            matchedCriteria++;
        }

        return ((double) matchedCriteria / totalCriteria) * 100;
    }
}