package SmartPlacement.backend.dto;

public class EligibilityResponse {

    private boolean eligible;
    private String message;

    private Double studentCgpa;
    private Double requiredCgpa;

    private Integer studentBacklogs;
    private Integer maximumBacklogs;

    private Double studentTenthPercentage;
    private Double requiredTenthPercentage;

    private Double studentTwelfthPercentage;
    private Double requiredTwelfthPercentage;

    public EligibilityResponse() {
    }

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Double getStudentCgpa() {
        return studentCgpa;
    }

    public void setStudentCgpa(Double studentCgpa) {
        this.studentCgpa = studentCgpa;
    }

    public Double getRequiredCgpa() {
        return requiredCgpa;
    }

    public void setRequiredCgpa(Double requiredCgpa) {
        this.requiredCgpa = requiredCgpa;
    }

    public Integer getStudentBacklogs() {
        return studentBacklogs;
    }

    public void setStudentBacklogs(Integer studentBacklogs) {
        this.studentBacklogs = studentBacklogs;
    }

    public Integer getMaximumBacklogs() {
        return maximumBacklogs;
    }

    public void setMaximumBacklogs(Integer maximumBacklogs) {
        this.maximumBacklogs = maximumBacklogs;
    }

    public Double getStudentTenthPercentage() {
        return studentTenthPercentage;
    }

    public void setStudentTenthPercentage(Double studentTenthPercentage) {
        this.studentTenthPercentage = studentTenthPercentage;
    }

    public Double getRequiredTenthPercentage() {
        return requiredTenthPercentage;
    }

    public void setRequiredTenthPercentage(Double requiredTenthPercentage) {
        this.requiredTenthPercentage = requiredTenthPercentage;
    }

    public Double getStudentTwelfthPercentage() {
        return studentTwelfthPercentage;
    }

    public void setStudentTwelfthPercentage(Double studentTwelfthPercentage) {
        this.studentTwelfthPercentage = studentTwelfthPercentage;
    }

    public Double getRequiredTwelfthPercentage() {
        return requiredTwelfthPercentage;
    }

    public void setRequiredTwelfthPercentage(Double requiredTwelfthPercentage) {
        this.requiredTwelfthPercentage = requiredTwelfthPercentage;
    }
}