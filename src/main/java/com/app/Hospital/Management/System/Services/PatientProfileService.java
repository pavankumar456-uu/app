package com.app.Hospital.Management.System.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.Hospital.Management.System.entities.MedicalHistory;
import com.app.Hospital.Management.System.entities.PatientProfile;
import com.app.Hospital.Management.System.exceptions.IdNotFoundException;
import com.app.Hospital.Management.System.repositories.AppointmentRepository;
import com.app.Hospital.Management.System.repositories.PatientProfileRepository;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PatientProfileService {

    private static final Logger logger = LoggerFactory.getLogger(PatientProfileService.class);

    @Autowired
    private PatientProfileRepository patientRepository;

    @Autowired 
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalHistoryService medicalHistoryService;

    public PatientProfile savePatient(PatientProfile p) {
        logger.info("Saving patient profile: {}", p);
        try {
            PatientProfile savedPatient = patientRepository.save(p);
            logger.info("Patient profile saved successfully: {}", savedPatient);
            return savedPatient;
        } catch (Exception e) {
            logger.error("Error saving patient profile: {}", p, e);
            throw new RuntimeException("Error saving patient profile", e);
        }
    }

    public List<PatientProfile> getAllPatients() {
        logger.info("Fetching all patient profiles");
        try {
            List<PatientProfile> patients = patientRepository.findAll();
            logger.info("Fetched {} patient profiles", patients.size());
            return patients;
        } catch (Exception e) {
            logger.error("Error fetching all patient profiles", e);
            throw new RuntimeException("Error fetching all patient profiles", e);
        }
    }

    public Optional<PatientProfile> getPatientById(Long id) {
        logger.info("Fetching patient profile by ID: {}", id);
        try {
            Optional<PatientProfile> patient = patientRepository.findById(id);
            if (patient.isPresent()) {
                logger.info("Patient profile found: {}", patient.get());
            } else {
                logger.warn("Patient profile not found with ID: {}", id);
                throw new IdNotFoundException("Patient not found with ID: " + id);
            }
            return patient;
        } catch (Exception e) {
            logger.error("Error fetching patient profile by ID: {}", id, e);
            throw new RuntimeException("Error fetching patient profile by ID", e);
        }
    }

    @Transactional
    public void deletePatient(Long id) {
        logger.info("Deleting patient profile by ID: {}", id);
        try {
            if (!patientRepository.existsById(id)) {
                throw new IdNotFoundException("Patient not found with ID: " + id);
            }
            appointmentRepository.deleteByPatientId(id);
            patientRepository.deleteById(id);
            logger.info("Patient profile deleted successfully by ID: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting patient profile by ID: {}", id, e);
            throw new RuntimeException("Error deleting patient profile by ID", e);
        }
    }
    public PatientProfile updatePatient(Long patientId, PatientProfile p) {
        logger.info("Updating patient profile with ID: {}", patientId);
        try {
            Optional<PatientProfile> existingPatient = patientRepository.findById(patientId);
            if (existingPatient.isPresent()) {
                PatientProfile patientProfile = existingPatient.get();
    
                // Update name if provided
                if (p.getName() != null) {
                    patientProfile.setName(p.getName());
                }
    
                // Update contact details if provided
                if (p.getContactDetails() != null) {
                    patientProfile.setContactDetails(p.getContactDetails());
                }
    
                // Fetch and update medical history using email
                if (patientProfile.getEmail() != null) {
                    List<MedicalHistory> medicalHistory = medicalHistoryService.viewMedicalHistory(patientProfile.getEmail());
                    patientProfile.setMedicalHistory(medicalHistory);
                }
    
                // Save the updated patient profile
                PatientProfile updatedPatient = patientRepository.save(patientProfile);
                logger.info("Patient profile updated successfully: {}", updatedPatient);
                return updatedPatient;
            } else {
                logger.warn("Patient profile not found with ID: {}", patientId);
                throw new IdNotFoundException("Patient not found with ID: " + patientId);
            }
        } catch (Exception e) {
            logger.error("Error updating patient profile with ID: {}", patientId, e);
            throw new RuntimeException("Error updating patient profile", e);
        }
    }
}