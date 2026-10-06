package SmartPlacement.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "placement_readiness")
public class PlacementReadiness {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    private Double cgpaScore;

    private Double skillScore;

    private Double eligibilityScore;

    private Double applicationScore;

    private Double interviewScore;

    private Double overallScore;

    private String readinessLevel;

    private LocalDateTime calculatedAt;

    public PlacementReadiness() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Double getCgpaScore() {
        return cgpaScore;
    }

    public void setCgpaScore(Double cgpaScore) {
        this.cgpaScore = cgpaScore;
    }

    public Double getSkillScore() {
        return skillScore;
    }

    public void setSkillScore(Double skillScore) {
        this.skillScore = skillScore;
    }

    public Double getEligibilityScore() {
        return eligibilityScore;
    }

    public void setEligibilityScore(Double eligibilityScore) {
        this.eligibilityScore = eligibilityScore;
    }

    public Double getApplicationScore() {
        return applicationScore;
    }

    public void setApplicationScore(Double applicationScore) {
        this.applicationScore = applicationScore;
    }

    public Double getInterviewScore() {
        return interviewScore;
    }

    public void setInterviewScore(Double interviewScore) {
        this.interviewScore = interviewScore;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public String getReadinessLevel() {
        return readinessLevel;
    }

    public void setReadinessLevel(String readinessLevel) {
        this.readinessLevel = readinessLevel;
    }

    public LocalDateTime getCalculatedAt() {
        return calculatedAt;
    }

    public void setCalculatedAt(LocalDateTime calculatedAt) {
        this.calculatedAt = calculatedAt;
    }
}