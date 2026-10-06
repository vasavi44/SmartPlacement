package SmartPlacement.backend.service;

import org.springframework.stereotype.Service;

import SmartPlacement.backend.dto.EligibilityResponse;
import SmartPlacement.backend.entity.Job;
import SmartPlacement.backend.entity.Student;
import SmartPlacement.backend.repository.JobRepository;
import SmartPlacement.backend.repository.StudentRepository;

@Service
public class EligibilityService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    public EligibilityService(
            StudentRepository studentRepository,
            JobRepository jobRepository) {

        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }

    public EligibilityResponse checkEligibility(Long studentId, Long jobId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // The project stores 10th score as a value out of 10.
        // Convert it to percentage for comparison with job requirements.
        double tenthPercentage = student.getTenthPercentage();

        if (tenthPercentage <= 10) {
            tenthPercentage = tenthPercentage * 10;
        }

        double twelfthPercentage = student.getTwelfthPercentage();

        boolean eligible =
                student.getCgpa() >= job.getMinimumCgpa()
                && student.getBacklogs() <= job.getMaximumBacklogs()
                && tenthPercentage >= job.getMinimumTenthPercentage()
                && twelfthPercentage >= job.getMinimumTwelfthPercentage();

        EligibilityResponse response = new EligibilityResponse();

        response.setEligible(eligible);

        response.setStudentCgpa(student.getCgpa());
        response.setRequiredCgpa(job.getMinimumCgpa());

        response.setStudentBacklogs(student.getBacklogs());
        response.setMaximumBacklogs(job.getMaximumBacklogs());

        response.setStudentTenthPercentage(tenthPercentage);
        response.setRequiredTenthPercentage(
                job.getMinimumTenthPercentage()
        );

        response.setStudentTwelfthPercentage(twelfthPercentage);
        response.setRequiredTwelfthPercentage(
                job.getMinimumTwelfthPercentage()
        );

        if (eligible) {
            response.setMessage("Student is eligible for this job.");
        } else {
            response.setMessage("Student is not eligible for this job.");
        }

        return response;
    }
}