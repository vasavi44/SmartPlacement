package SmartPlacement.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import SmartPlacement.backend.entity.StudentSkill;

public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {

    List<StudentSkill> findByStudentId(Long studentId);

    Optional<StudentSkill> findByStudentIdAndSkillId(Long studentId, Long skillId);
}