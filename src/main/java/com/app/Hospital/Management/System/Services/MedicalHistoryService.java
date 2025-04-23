package com.app.Hospital.Management.System.Services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.Hospital.Management.System.entities.MedicalHistory;
import com.app.Hospital.Management.System.entities.PatientProfile;
import com.app.Hospital.Management.System.exceptions.ResourceNotFoundException;
import com.app.Hospital.Management.System.repositories.MedicalHistoryRepository;
import com.app.Hospital.Management.System.repositories.PatientProfileRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MedicalHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(MedicalHistoryService.class);

    @Autowired
    private MedicalHistoryRepository medicalHistoryRepository;

    @Autowired
private PatientProfileRepository patientProfileRepository;

public MedicalHistory addMedicalHistory(MedicalHistory medicalHistory) {
    logger.info("Adding medical history: {}", medicalHistory);
    try {
        if (medicalHistory.getPatient() == null || medicalHistory.getPatient().getPatientId() == null) {
            throw new RuntimeException("Patient profile is mandatory");
        }

        // Fetch the full PatientProfile object from the database
        Long patientId = medicalHistory.getPatient().getPatientId();
        PatientProfile patient = patientProfileRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient with ID " + patientId + " does not exist"));

        // Set the full PatientProfile object in the MedicalHistory
        medicalHistory.setPatient(patient);

        MedicalHistory savedMedicalHistory = medicalHistoryRepository.save(medicalHistory);
        logger.info("Medical history added successfully: {}", savedMedicalHistory);
        return savedMedicalHistory;
    } catch (Exception e) {
        logger.error("Error adding medical history: {}", medicalHistory, e);
        throw new RuntimeException("Error adding medical history", e);
    }
}

    public List<MedicalHistory> viewMedicalHistory(String email) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'viewMedicalHistory'");
    }

    public List<MedicalHistory> viewMedicalHistoryByEmail(String email) {
        // Fetch the patient by email
        PatientProfile patient = patientProfileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + email));

        // Fetch the medical history for the patient
        return medicalHistoryRepository.findByPatient(patient);
    }
}