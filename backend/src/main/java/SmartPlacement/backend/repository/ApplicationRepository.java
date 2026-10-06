package SmartPlacement.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import SmartPlacement.backend.entity.Application;
import SmartPlacement.backend.entity.ApplicationStatus;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByStudentId(Long studentId);

    List<Application> findByJobId(Long jobId);

    List<Application> findByStatus(ApplicationStatus status);
}