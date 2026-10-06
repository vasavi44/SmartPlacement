package SmartPlacement.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import SmartPlacement.backend.dto.EligibilityResponse;
import SmartPlacement.backend.service.EligibilityService;

@RestController
@RequestMapping("/api/eligibility")
@CrossOrigin(origins = "http://localhost:3000")
public class EligibilityController {

    private final EligibilityService eligibilityService;

    public EligibilityController(EligibilityService eligibilityService) {
        this.eligibilityService = eligibilityService;
    }

    @GetMapping("/student/{studentId}/job/{jobId}")
    public EligibilityResponse checkEligibility(
            @PathVariable Long studentId,
            @PathVariable Long jobId) {

        return eligibilityService.checkEligibility(studentId, jobId);
    }
}