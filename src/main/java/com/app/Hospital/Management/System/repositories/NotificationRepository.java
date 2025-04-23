package com.app.Hospital.Management.System.repositories;
 
import java.util.List;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.app.Hospital.Management.System.entities.DoctorSchedule;
import com.app.Hospital.Management.System.entities.Notification;
import com.app.Hospital.Management.System.entities.PatientProfile;
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
 
//  @Query("select m from Notification n where n.patient IN (select p from PatientProfile p where p.patientId= :patientId)")
//  List<Notification> findByPatientId(Long patientId);
 @Query("SELECT n FROM Notification n WHERE n.appointment.patient.patientId = :patientId")
    List<Notification> findNotificationsByPatientId(@Param("patientId") Long patientId);
 
    // Fetch notifications for a specific doctor
    @Query("SELECT n FROM Notification n WHERE n.appointment.doctor.doctorId = :doctorId")
    List<Notification> findNotificationsByDoctorId(@Param("doctorId") Long doctorId);

    List<Notification> findByAppointment_Patient(PatientProfile patient);
    List<Notification> findByAppointment_Doctor(DoctorSchedule doctor);
}
 
 