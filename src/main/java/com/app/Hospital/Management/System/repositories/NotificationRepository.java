package com.app.Hospital.Management.System.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.app.Hospital.Management.System.entities.Notification;
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

//	@Query("select m from Notification n where n.patient IN (select p from PatientProfile p where p.patientId= :patientId)")
//	List<Notification> findByPatientId(Long patientId);

}
