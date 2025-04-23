package com.app.Hospital.Management.System.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.Hospital.Management.System.Services.PatientProfileService;
import com.app.Hospital.Management.System.entities.PatientProfile;
import com.app.Hospital.Management.System.exceptions.IdNotFoundException;
//import com.app.Hospital.Management.System.repositories.PatientProfileRepository;

import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/hospital/patients")
public class PatientProfileController {
	@Autowired
	private PatientProfileService patientProfileService;
	 
	@PostMapping("/save")
	public ResponseEntity<PatientProfile> savePatient(@Valid @RequestBody PatientProfile p){
		 
		PatientProfile savedPatient=patientProfileService.savePatient(p);
		return ResponseEntity.ok(savedPatient);
	}
	
	
	@GetMapping("/get")
	public ResponseEntity<List<PatientProfile>> getAllPatients(){
		List<PatientProfile> patients=patientProfileService.getAllPatients();
		if (patients.isEmpty()) {
            throw new IdNotFoundException("No patients found");
        }
		return ResponseEntity.ok(patients);
	
	}
	
	@GetMapping("get/{id}")
    public ResponseEntity<PatientProfile> getPatientById(@PathVariable Long id) {
        Optional<PatientProfile> patient = patientProfileService.getPatientById(id);
        if (patient != null) {
            return ResponseEntity.ok(patient.get());
        } else {
            throw new IdNotFoundException("Patient not found with ID: " + id);
        }
	}
	
	@PutMapping("/put/{id}")
	public ResponseEntity<PatientProfile> updatePatient(@PathVariable Long id, @RequestBody PatientProfile p) {
		if (!patientProfileService.getPatientById(id).isPresent()) {
            throw new IdNotFoundException("Patient not found with ID: " + id);
        }
		p.setPatientId(id); // Ensure the ID is set correctly
	    PatientProfile updatedPatient = patientProfileService.updatePatient(id,p);
	    return ResponseEntity.ok(updatedPatient);
	}
	@DeleteMapping("del/{id}")
	public ResponseEntity<Void> deletePatient(@PathVariable Long id){
		 if (!patientProfileService.getPatientById(id).isPresent()) {
	            throw new IdNotFoundException("Patient not found with ID: " + id);
	        }
		patientProfileService.deletePatient(id);
		return ResponseEntity.noContent().build();
	}
    
}
