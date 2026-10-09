package SmartPlacement.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Kept for compatibility with the existing frontend and database
    private String companyName;

    private String jobTitle;

    private String location;

    @Column(length = 2000)
    private String description;

    private Double minimumCgpa;

    private Integer maximumBacklogs;

    private Double minimumTenthPercentage;

    private Double minimumTwelfthPercentage;

    private String status = "OPEN";

    // Links this job to the company that created it
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    public Job() {
    }

    // =========================
    // GETTERS AND SETTERS
    // =========================

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

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}