package com.app.Hospital.Management.System.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.app.Hospital.Management.System.Services.MedicalHistoryService;
import com.app.Hospital.Management.System.entities.MedicalHistory;
import com.app.Hospital.Management.System.exceptions.BadRequestException;
import com.app.Hospital.Management.System.exceptions.ResourceNotFoundException;
import com.app.Hospital.Management.System.exceptions.ServiceUnavailableException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hospital/history")
@Validated
public class MedicalHistoryController {

    @Autowired
    private MedicalHistoryService medicalHistoryService;

    @PostMapping("/save")
    public ResponseEntity<MedicalHistory> addMedicalHistory(@Valid @RequestBody MedicalHistory medicalHistory) {
        try {
            MedicalHistory newHistory = medicalHistoryService.addMedicalHistory(medicalHistory);
            return ResponseEntity.ok(newHistory);
        } catch (Exception e) {
            throw new ServiceUnavailableException("Service is temporarily unavailable. Please try again later.");
        }
    }

    @GetMapping("/view/{email}")
    public ResponseEntity<List<MedicalHistory>> viewMedicalHistory(@PathVariable("email") String email) {
        if (email == null || email.isEmpty()) {
            throw new BadRequestException("Email cannot be null or empty");
        }
        List<MedicalHistory> history = medicalHistoryService.viewMedicalHistory(email);
        if (history == null || history.isEmpty()) {
            throw new ResourceNotFoundException("No medical history found for email: " + email);
        }
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/delete/{email}")
    public ResponseEntity<Void> deleteMedicalHistory(@PathVariable String email) {
        try {
            medicalHistoryService.deleteMedicalHistory(email);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new ResourceNotFoundException("Failed to delete medical history for email: " + email);
        }
    }
}