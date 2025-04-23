package com.app.Hospital.Management.System.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.Hospital.Management.System.entities.Appointment;
import com.app.Hospital.Management.System.entities.Notification;
import com.app.Hospital.Management.System.entities.PatientProfile;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find appointments by patient ID
    List<Appointment> findByPatient_PatientId(Long patientId);

    // Delete appointments by patient ID
    @Modifying
    @Query("DELETE FROM Appointment a WHERE a.patient.patientId = :patientId")
    void deleteByPatientId(@Param("patientId") Long patientId);

    Optional<Notification> findByAppointmentId(Long appointmentID);

    List<Appointment> findByPatient(PatientProfile patient);

    void deleteByPatient(PatientProfile patient);
}