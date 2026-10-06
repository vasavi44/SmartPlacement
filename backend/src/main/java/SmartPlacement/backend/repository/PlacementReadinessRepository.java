package SmartPlacement.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import SmartPlacement.backend.entity.PlacementReadiness;

public interface PlacementReadinessRepository
        extends JpaRepository<PlacementReadiness, Long> {

    Optional<PlacementReadiness> findByStudentId(Long studentId);
}