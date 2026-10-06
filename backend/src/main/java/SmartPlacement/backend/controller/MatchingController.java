package SmartPlacement.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import SmartPlacement.backend.dto.MatchingResponse;
import SmartPlacement.backend.service.MatchingService;

@RestController
@RequestMapping("/api/matching")
@CrossOrigin(origins = "http://localhost:5174")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping("/student/{studentId}/job/{jobId}")
    public MatchingResponse calculateMatch(
            @PathVariable Long studentId,
            @PathVariable Long jobId) {

        return matchingService.calculateMatch(studentId, jobId);
    }
}