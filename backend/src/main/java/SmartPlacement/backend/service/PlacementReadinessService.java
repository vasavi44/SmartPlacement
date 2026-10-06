package SmartPlacement.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import SmartPlacement.backend.entity.Application;
import SmartPlacement.backend.entity.Interview;
import SmartPlacement.backend.entity.PlacementReadiness;
import SmartPlacement.backend.entity.Student;
import SmartPlacement.backend.entity.StudentSkill;
import SmartPlacement.backend.repository.ApplicationRepository;
import SmartPlacement.backend.repository.InterviewRepository;
import SmartPlacement.backend.repository.PlacementReadinessRepository;
import SmartPlacement.backend.repository.StudentRepository;
import SmartPlacement.backend.repository.StudentSkillRepository;

@Service
public class PlacementReadinessService {

    private final StudentRepository studentRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final PlacementReadinessRepository readinessRepository;

    public PlacementReadinessService(
            StudentRepository studentRepository,
            StudentSkillRepository studentSkillRepository,
            ApplicationRepository applicationRepository,
            InterviewRepository interviewRepository,
            PlacementReadinessRepository readinessRepository) {

        this.studentRepository = studentRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
        this.readinessRepository = readinessRepository;
    }

    public PlacementReadiness calculateReadiness(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        // -----------------------------
        // 1. CGPA SCORE - 25%
        // -----------------------------

        double cgpaScore = 0;

        if (student.getCgpa() != null) {
            cgpaScore = (student.getCgpa() / 10.0) * 100;

            if (cgpaScore > 100) {
                cgpaScore = 100;
            }
        }

        // -----------------------------
        // 2. SKILL SCORE - 30%
        // -----------------------------

        List<StudentSkill> studentSkills =
                studentSkillRepository.findByStudentId(studentId);

        double skillScore = 0;

        if (!studentSkills.isEmpty()) {
            skillScore = Math.min(
                    studentSkills.size() * 25,
                    100
            );
        }

        // -----------------------------
        // 3. ELIGIBILITY SCORE - 20%
        // -----------------------------

        double eligibilityScore = 0;

        if (student.getCgpa() != null
                && student.getCgpa() >= 7.0
                && student.getBacklogs() != null
                && student.getBacklogs() == 0
                && student.getTenthPercentage() != null
                && student.getTenthPercentage() >= 60
                && student.getTwelfthPercentage() != null
                && student.getTwelfthPercentage() >= 60) {

            eligibilityScore = 100;
        }

        // -----------------------------
        // 4. APPLICATION SCORE - 15%
        // -----------------------------

        List<Application> applications =
                applicationRepository.findByStudentId(studentId);

        double applicationScore = 0;

        if (!applications.isEmpty()) {
            applicationScore = Math.min(
                    applications.size() * 25,
                    100
            );
        }

        // -----------------------------
        // 5. INTERVIEW SCORE - 10%
        // -----------------------------

        List<Interview> interviews =
                interviewRepository
                        .findByApplicationStudentId(studentId);

        double interviewScore = 0;

        if (!interviews.isEmpty()) {
            interviewScore = Math.min(
                    interviews.size() * 50,
                    100
            );
        }

        // -----------------------------
        // OVERALL SCORE
        // -----------------------------

        double overallScore =
                (cgpaScore * 0.25)
                + (skillScore * 0.30)
                + (eligibilityScore * 0.20)
                + (applicationScore * 0.15)
                + (interviewScore * 0.10);

        // Round to 2 decimal places
        overallScore =
                Math.round(overallScore * 100.0) / 100.0;

        // -----------------------------
        // READINESS LEVEL
        // -----------------------------

        String readinessLevel;

        if (overallScore >= 80) {
            readinessLevel = "HIGH";
        } else if (overallScore >= 60) {
            readinessLevel = "MEDIUM";
        } else {
            readinessLevel = "LOW";
        }

        // -----------------------------
        // SAVE RESULT
        // -----------------------------

        PlacementReadiness readiness =
                readinessRepository
                        .findByStudentId(studentId)
                        .orElse(new PlacementReadiness());

        readiness.setStudent(student);
        readiness.setCgpaScore(cgpaScore);
        readiness.setSkillScore(skillScore);
        readiness.setEligibilityScore(eligibilityScore);
        readiness.setApplicationScore(applicationScore);
        readiness.setInterviewScore(interviewScore);
        readiness.setOverallScore(overallScore);
        readiness.setReadinessLevel(readinessLevel);
        readiness.setCalculatedAt(LocalDateTime.now());

        return readinessRepository.save(readiness);
    }

    public PlacementReadiness getReadiness(Long studentId) {

        return readinessRepository
                .findByStudentId(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Placement readiness not calculated yet"));
    }
}