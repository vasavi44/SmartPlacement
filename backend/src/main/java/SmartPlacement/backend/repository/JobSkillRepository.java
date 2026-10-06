package SmartPlacement.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import SmartPlacement.backend.entity.JobSkill;

public interface JobSkillRepository extends JpaRepository<JobSkill, Long> {

    List<JobSkill> findByJobId(Long jobId);

    Optional<JobSkill> findByJobIdAndSkillId(Long jobId, Long skillId);
}