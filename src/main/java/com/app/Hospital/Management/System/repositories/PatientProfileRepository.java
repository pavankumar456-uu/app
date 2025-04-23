package com.app.Hospital.Management.System.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.Hospital.Management.System.entities.PatientProfile;
//import com.app.Hospital.Management.System.entities.User; // Remove this import if not needed

@Repository
public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
    Optional<PatientProfile> findByEmail(String email);

}