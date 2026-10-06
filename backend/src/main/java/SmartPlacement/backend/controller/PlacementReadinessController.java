package SmartPlacement.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import SmartPlacement.backend.entity.PlacementReadiness;
import SmartPlacement.backend.service.PlacementReadinessService;

@RestController
@RequestMapping("/api/placement-readiness")
@CrossOrigin(origins = "http://localhost:3000")
public class PlacementReadinessController {

    private final PlacementReadinessService readinessService;

    public PlacementReadinessController(
            PlacementReadinessService readinessService) {

        this.readinessService = readinessService;
    }

    // Calculate placement readiness
    @PostMapping("/student/{studentId}/calculate")
    public PlacementReadiness calculateReadiness(
            @PathVariable Long studentId) {

        return readinessService.calculateReadiness(studentId);
    }

    // Get existing placement readiness
    @GetMapping("/student/{studentId}")
    public PlacementReadiness getReadiness(
            @PathVariable Long studentId) {

        return readinessService.getReadiness(studentId);
    }
}