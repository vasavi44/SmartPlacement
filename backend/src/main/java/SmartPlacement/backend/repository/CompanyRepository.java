package SmartPlacement.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import SmartPlacement.backend.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByRecruiterId(Long recruiterId);
}
