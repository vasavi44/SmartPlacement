package SmartPlacement.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import SmartPlacement.backend.entity.Interview;

public interface InterviewRepository
        extends JpaRepository<Interview, Long> {

    Optional<Interview> findByApplicationId(
            Long applicationId);

    List<Interview> findByApplicationStudentId(
            Long studentId);

    List<Interview> findByApplicationJobId(
            Long jobId);

    List<Interview> findByStatus(
            SmartPlacement.backend.entity.InterviewStatus status);
}