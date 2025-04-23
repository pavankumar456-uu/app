package com.app.Hospital.Management.System.Controllers;

import java.util.List;
//import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.app.Hospital.Management.System.Services.DoctorScheduleService;
import com.app.Hospital.Management.System.entities.DoctorSchedule;
//import com.app.Hospital.Management.System.entities.PatientProfile;
import com.app.Hospital.Management.System.exceptions.ConflictException;
import com.app.Hospital.Management.System.exceptions.IdNotFoundException;
import com.app.Hospital.Management.System.exceptions.ServiceUnavailableException;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/hospital/doctors")
public class DoctorScheduleController {
	
	@Autowired
	private DoctorScheduleService doctorScheduleService;
	
	@PostMapping("/save")
	@Transactional
	public ResponseEntity<DoctorSchedule> saveDoctor(@RequestBody DoctorSchedule d){
		 try {
	            DoctorSchedule doc = doctorScheduleService.saveDoctor(d);
	            return ResponseEntity.ok(doc);
	        } catch (Exception e) {
	            throw new ServiceUnavailableException("Service is temporarily unavailable. Please try again later.");
	        }
	}
	
	@GetMapping("/get")
	public ResponseEntity<List<DoctorSchedule>> getAllDoctors(){
		List<DoctorSchedule> doctors=doctorScheduleService.getAllDoctors();
		 if (doctors.isEmpty()) {
	            throw new IdNotFoundException("No doctors found");
	        }
		return ResponseEntity.ok(doctors);
	}
	
	@PutMapping("/create/{id}")
	public ResponseEntity<String> createAvailability(@PathVariable Long id){
		
		
        try {
            String s = doctorScheduleService.createAvailability(id);
            return ResponseEntity.ok(s);
        } catch (Exception e) {
            throw new ConflictException("Conflict occurred while creating availability for doctor ID: " + id);
        }
    }	
}
