package SmartPlacement.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import SmartPlacement.backend.entity.Student;

public interface StudentRepository
        extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);
}