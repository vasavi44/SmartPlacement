package SmartPlacement.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import SmartPlacement.backend.entity.Job;

public interface JobRepository extends JpaRepository<Job, Long> {

}