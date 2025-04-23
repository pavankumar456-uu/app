package com.app.Hospital.Management.System.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.Hospital.Management.System.entities.MedicalHistory;
import com.app.Hospital.Management.System.repositories.MedicalHistoryRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MedicalHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(MedicalHistoryService.class);

    @Autowired
    private MedicalHistoryRepository medicalHistoryRepository;

    public MedicalHistory addMedicalHistory(MedicalHistory medicalHistory) {
        logger.info("Adding medical history: {}", medicalHistory);
        try {
            MedicalHistory savedMedicalHistory = medicalHistoryRepository.save(medicalHistory);
            logger.info("Medical history added successfully: {}", savedMedicalHistory);
            return savedMedicalHistory;
        } catch (Exception e) {
            logger.error("Error adding medical history: {}", medicalHistory, e);
            throw new RuntimeException("Error adding medical history", e);
        }
    }

    public List<MedicalHistory> viewMedicalHistory(String email) {
        logger.info("Viewing medical history for email: {}", email);
        try {
            List<MedicalHistory> medicalHistories = medicalHistoryRepository.findByEmail(email);
            logger.info("Fetched {} medical histories for email: {}", medicalHistories.size(), email);
            return medicalHistories;
        } catch (Exception e) {
            logger.error("Error viewing medical history for email: {}", email, e);
            throw new RuntimeException("Error viewing medical history", e);
        }
    }

    public void deleteMedicalHistory(String email) {
        logger.info("Deleting medical history for email: {}", email);
        try {
            List<MedicalHistory> medicalHistories = medicalHistoryRepository.findByEmail(email);
            if (medicalHistories != null && !medicalHistories.isEmpty()) {
                medicalHistoryRepository.deleteAll(medicalHistories);
                logger.info("Deleted medical histories for email: {}", email);
            } else {
                logger.warn("No medical histories found for email: {}", email);
            }
        } catch (Exception e) {
            logger.error("Error deleting medical history for email: {}", email, e);
            throw new RuntimeException("Error deleting medical history", e);
        }
    }
}