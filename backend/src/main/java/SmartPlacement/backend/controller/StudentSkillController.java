package SmartPlacement.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import SmartPlacement.backend.entity.Skill;
import SmartPlacement.backend.entity.Student;
import SmartPlacement.backend.entity.StudentSkill;
import SmartPlacement.backend.repository.SkillRepository;
import SmartPlacement.backend.repository.StudentRepository;
import SmartPlacement.backend.repository.StudentSkillRepository;

@RestController
@RequestMapping("/api/student-skills")
@CrossOrigin(origins = "http://localhost:5174")
public class StudentSkillController {

    private final StudentSkillRepository studentSkillRepository;
    private final StudentRepository studentRepository;
    private final SkillRepository skillRepository;

    public StudentSkillController(
            StudentSkillRepository studentSkillRepository,
            StudentRepository studentRepository,
            SkillRepository skillRepository) {

        this.studentSkillRepository = studentSkillRepository;
        this.studentRepository = studentRepository;
        this.skillRepository = skillRepository;
    }

    // ADD SKILL
    @PostMapping("/student/{studentId}/skill/{skillId}")
    public StudentSkill addSkillToStudent(
            @PathVariable Long studentId,
            @PathVariable Long skillId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        // Prevent duplicate skill
        if (studentSkillRepository
                .findByStudentIdAndSkillId(studentId, skillId)
                .isPresent()) {

            throw new RuntimeException("Skill already added");
        }

        StudentSkill studentSkill = new StudentSkill();

        studentSkill.setStudent(student);
        studentSkill.setSkill(skill);

        return studentSkillRepository.save(studentSkill);
    }

    // GET STUDENT SKILLS
    @GetMapping("/student/{studentId}")
    public List<StudentSkill> getStudentSkills(
            @PathVariable Long studentId) {

        return studentSkillRepository.findByStudentId(studentId);
    }

    // REMOVE SKILL
    @DeleteMapping("/student/{studentId}/skill/{skillId}")
    public String removeSkillFromStudent(
            @PathVariable Long studentId,
            @PathVariable Long skillId) {

        StudentSkill studentSkill = studentSkillRepository
                .findByStudentIdAndSkillId(studentId, skillId)
                .orElseThrow(() -> new RuntimeException("Skill not added to student"));

        studentSkillRepository.delete(studentSkill);

        return "Skill removed successfully";
    }
}