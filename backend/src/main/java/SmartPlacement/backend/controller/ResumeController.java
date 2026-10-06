package SmartPlacement.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import SmartPlacement.backend.entity.Student;
import SmartPlacement.backend.repository.StudentRepository;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:5174")
public class ResumeController {

    private final StudentRepository studentRepository;

    private final String uploadDirectory =
            "uploads/resumes/";

    public ResumeController(
            StudentRepository studentRepository) {

        this.studentRepository = studentRepository;
    }

    @PostMapping("/student/{studentId}")
    public ResponseEntity<String> uploadResume(
            @PathVariable Long studentId,
            @RequestParam("resume") MultipartFile file)
            throws IOException {

        Student student = studentRepository
                .findById(studentId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Student not found"
                        )
                );

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Please select a resume");
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null ||
                !(fileName.toLowerCase().endsWith(".pdf")
                || fileName.toLowerCase().endsWith(".doc")
                || fileName.toLowerCase().endsWith(".docx"))) {

            return ResponseEntity.badRequest()
                    .body(
                        "Only PDF, DOC and DOCX files are allowed"
                    );
        }

        if (file.getSize() > 5 * 1024 * 1024) {

            return ResponseEntity.badRequest()
                    .body(
                        "Resume size must be less than 5 MB"
                    );
        }

        Path directory =
                Paths.get(uploadDirectory);

        Files.createDirectories(directory);

        String savedFileName =
                "student_" +
                studentId +
                "_" +
                fileName;

        Path filePath =
                directory.resolve(savedFileName);

        Files.write(
                filePath,
                file.getBytes()
        );

        return ResponseEntity.ok(
                "Resume uploaded successfully"
        );
    }
}