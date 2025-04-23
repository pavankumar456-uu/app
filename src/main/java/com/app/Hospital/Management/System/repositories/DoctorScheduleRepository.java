package com.app.Hospital.Management.System.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.Hospital.Management.System.entities.Appointment;
import com.app.Hospital.Management.System.entities.DoctorSchedule;
import com.app.Hospital.Management.System.entities.ScheduledId;
@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, ScheduledId> {

	
	List<DoctorSchedule> findByDoctorId(Long id);

	Optional<DoctorSchedule> findByDoctorIdAndDate(Long doctorId, LocalDate newDate);
	

}

//Candidate has good technical knowledge and is able to answers the technical questions asked on JAVA , SQL, REST API.
//He has shown his project and was able to demonstrate it very well. Even when asked many questions about his project he was able to answer all of them.
//Project created by candidate is based on latest technologies and he was able to explain the annotations used in the project. 
