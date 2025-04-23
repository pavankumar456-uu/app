package com.app.Hospital.Management.System.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.Hospital.Management.System.entities.Appointment;
import com.app.Hospital.Management.System.entities.AppointmentStatus;
import com.app.Hospital.Management.System.entities.Notification;
import com.app.Hospital.Management.System.entities.PatientProfile;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByStatus(AppointmentStatus status);

    @Modifying
    @Query("DELETE FROM Appointment a WHERE a.patient.patientId = :patientId")
    void deleteByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.doctorId = :doctorId")
    List<Appointment> findAppointmentByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.patient.patientId = :patientId")
    List<Appointment> findByPatientId(@Param("patientId") Long patientId);

    List<Appointment> findByPatient_PatientId(Long patientId);

    List<Appointment> findByPatient(PatientProfile patient);

    Optional<Appointment> findByAppointmentId(Long appointmentID);
}