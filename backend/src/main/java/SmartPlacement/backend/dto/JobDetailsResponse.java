package SmartPlacement.backend.dto;

import java.util.List;

public class JobDetailsResponse {

    private Long id;
    private String companyName;
    private String jobTitle;
    private String location;
    private String description;

    private Double minimumCgpa;
    private Integer maximumBacklogs;
    private Double minimumTenthPercentage;
    private Double minimumTwelfthPercentage;

    private String status;

    private List<String> skills;

    public JobDetailsResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getMinimumCgpa() {
        return minimumCgpa;
    }

    public void setMinimumCgpa(Double minimumCgpa) {
        this.minimumCgpa = minimumCgpa;
    }

    public Integer getMaximumBacklogs() {
        return maximumBacklogs;
    }

    public void setMaximumBacklogs(Integer maximumBacklogs) {
        this.maximumBacklogs = maximumBacklogs;
    }

    public Double getMinimumTenthPercentage() {
        return minimumTenthPercentage;
    }

    public void setMinimumTenthPercentage(Double minimumTenthPercentage) {
        this.minimumTenthPercentage = minimumTenthPercentage;
    }

    public Double getMinimumTwelfthPercentage() {
        return minimumTwelfthPercentage;
    }

    public void setMinimumTwelfthPercentage(Double minimumTwelfthPercentage) {
        this.minimumTwelfthPercentage = minimumTwelfthPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}