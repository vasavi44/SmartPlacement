package SmartPlacement.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import SmartPlacement.backend.entity.Student;
import SmartPlacement.backend.repository.StudentRepository;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5174")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(
            StudentRepository studentRepository) {

        this.studentRepository =
                studentRepository;
    }

    // ==========================================
    // CREATE STUDENT
    // ==========================================

    @PostMapping
    public Student addStudent(
            @RequestBody Student student) {

        return studentRepository.save(student);
    }

    // ==========================================
    // GET ALL STUDENTS
    // ==========================================

    @GetMapping
    public List<Student> getAllStudents() {

        return studentRepository.findAll();
    }

    // ==========================================
    // GET STUDENT BY DATABASE ID
    // ==========================================

    @GetMapping("/{id}")
    public Student getStudentById(
            @PathVariable Long id) {

        return studentRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Student not found"
                        )
                );
    }

    // ==========================================
    // GET STUDENT BY EMAIL
    // ==========================================

    @GetMapping("/email/{email}")
    public Student getStudentByEmail(
            @PathVariable String email) {

        return studentRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Student profile not found"
                        )
                );
    }

    // ==========================================
    // UPDATE STUDENT PROFILE
    // ==========================================

    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable Long id,
            @RequestBody Student updatedStudent) {

        Student student =
                studentRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Student not found"
                                )
                        );

        // Student / Roll Number
        student.setStudentId(
                updatedStudent.getStudentId()
        );

        // Personal information
        student.setName(
                updatedStudent.getName()
        );

        student.setEmail(
                updatedStudent.getEmail()
        );

        student.setPhone(
                updatedStudent.getPhone()
        );

        // Academic information
        student.setCgpa(
                updatedStudent.getCgpa()
        );

        student.setTenthPercentage(
                updatedStudent
                        .getTenthPercentage()
        );

        student.setTwelfthPercentage(
                updatedStudent
                        .getTwelfthPercentage()
        );

        student.setBacklogs(
                updatedStudent.getBacklogs()
        );

        return studentRepository.save(student);
    }

    // ==========================================
    // DELETE STUDENT
    // ==========================================

    @DeleteMapping("/{id}")
    public String deleteStudent(
            @PathVariable Long id) {

        studentRepository.deleteById(id);

        return "Student deleted successfully";
    }
}