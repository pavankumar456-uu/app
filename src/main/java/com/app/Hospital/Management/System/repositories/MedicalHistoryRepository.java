package com.app.Hospital.Management.System.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.Hospital.Management.System.entities.MedicalHistory;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {
    // Query to fetch medical history by patient's email
    @Query("SELECT m FROM MedicalHistory m WHERE m.patient.email = :email")
    List<MedicalHistory> findByEmail(@Param("email") String email);
}