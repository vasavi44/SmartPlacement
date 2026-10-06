package SmartPlacement.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import SmartPlacement.backend.entity.Company;
import SmartPlacement.backend.entity.User;
import SmartPlacement.backend.entity.UserRole;
import SmartPlacement.backend.repository.CompanyRepository;
import SmartPlacement.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://localhost:5174")
public class CompanyController {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public CompanyController(
            CompanyRepository companyRepository,
            UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    // Get all companies
    @GetMapping
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    // Get company by ID
    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(
            @PathVariable Long id) {

        return companyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get company belonging to a recruiter
    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<Company> getCompanyByRecruiter(
            @PathVariable Long recruiterId) {

        return companyRepository
                .findByRecruiterId(recruiterId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create company for recruiter
    @PostMapping("/recruiter/{recruiterId}")
    public ResponseEntity<?> createCompany(
            @PathVariable Long recruiterId,
            @RequestBody Company company) {

        User recruiter = userRepository
                .findById(recruiterId)
                .orElse(null);

        if (recruiter == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Recruiter not found");
        }

        if (recruiter.getRole() != UserRole.RECRUITER) {
            return ResponseEntity
                    .badRequest()
                    .body("Only recruiter accounts can create companies");
        }

        if (companyRepository
                .findByRecruiterId(recruiterId)
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body("This recruiter already has a company");
        }

        company.setRecruiter(recruiter);

        Company savedCompany =
                companyRepository.save(company);

        return ResponseEntity.ok(savedCompany);
    }

    // Update company
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(
            @PathVariable Long id,
            @RequestBody Company updatedCompany) {

        Company company = companyRepository
                .findById(id)
                .orElse(null);

        if (company == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        company.setCompanyName(
                updatedCompany.getCompanyName()
        );

        company.setIndustry(
                updatedCompany.getIndustry()
        );

        company.setLocation(
                updatedCompany.getLocation()
        );

        company.setDescription(
                updatedCompany.getDescription()
        );

        company.setWebsite(
                updatedCompany.getWebsite()
        );

        return ResponseEntity.ok(
                companyRepository.save(company)
        );
    }

    // Delete company
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCompany(
            @PathVariable Long id) {

        if (!companyRepository.existsById(id)) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        companyRepository.deleteById(id);

        return ResponseEntity.ok(
                "Company deleted successfully"
        );
    }
}