package SmartPlacement.backend.dto;

import java.util.List;

public class MatchingResponse {

    private Long studentId;
    private Long jobId;

    private String studentName;
    private String jobTitle;
    private String companyName;

    private Double skillMatchPercentage;
    private Double academicScore;
    private Double overallMatchPercentage;

    private List<String> matchedSkills;
    private List<String> missingSkills;
    private boolean eligible;

    public MatchingResponse() {
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Double getSkillMatchPercentage() {
        return skillMatchPercentage;
    }

    public void setSkillMatchPercentage(Double skillMatchPercentage) {
        this.skillMatchPercentage = skillMatchPercentage;
    }

    public Double getAcademicScore() {
        return academicScore;
    }

    public void setAcademicScore(Double academicScore) {
        this.academicScore = academicScore;
    }

    public Double getOverallMatchPercentage() {
        return overallMatchPercentage;
    }

    public void setOverallMatchPercentage(Double overallMatchPercentage) {
        this.overallMatchPercentage = overallMatchPercentage;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }
}