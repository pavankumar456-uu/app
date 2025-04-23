package com.app.Hospital.Management.System.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.Hospital.Management.System.Services.DoctorScheduleService;
import com.app.Hospital.Management.System.entities.DoctorSchedule;
import com.app.Hospital.Management.System.exceptions.ConflictException;
import com.app.Hospital.Management.System.exceptions.IdNotFoundException;
import com.app.Hospital.Management.System.exceptions.ServiceUnavailableException;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/hospital/doctors")
public class DoctorScheduleController {

    @Autowired
    private DoctorScheduleService doctorScheduleService;

    /**
     * Save a new doctor schedule.
     */
    @PostMapping("/save")
    @Transactional
    public ResponseEntity<DoctorSchedule> saveDoctor(@RequestBody DoctorSchedule doctorSchedule) {
        try {
            DoctorSchedule savedDoctorSchedule = doctorScheduleService.saveDoctor(doctorSchedule);
            return ResponseEntity.ok(savedDoctorSchedule);
        } catch (Exception e) {
            throw new ServiceUnavailableException("Service is temporarily unavailable. Please try again later.");
        }
    }

    /**
     * Get all doctor schedules.
     */
    @GetMapping("/get")
    public ResponseEntity<List<DoctorSchedule>> getAllDoctors() {
        List<DoctorSchedule> doctors = doctorScheduleService.getAllDoctors();
        if (doctors.isEmpty()) {
            throw new IdNotFoundException("No doctors found");
        }
        return ResponseEntity.ok(doctors);
    }

    /**
     * Create availability for a doctor by ID.
     */
    @PutMapping("/create/{id}")
    public ResponseEntity<String> createAvailability(@PathVariable Long id) {
        try {
            String response = doctorScheduleService.createAvailability(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new ConflictException("Conflict occurred while creating availability for doctor ID: " + id);
        }
    }

    /**
     * Get a specific doctor schedule by doctor ID and date.
     */
    @GetMapping("/get/{doctorId}/{date}")
    public ResponseEntity<DoctorSchedule> getDoctorSchedule(@PathVariable Long doctorId, @PathVariable String date) {
        try {
            DoctorSchedule doctorSchedule = doctorScheduleService.getDoctorScheduleByIdAndDate(doctorId, date);
            return ResponseEntity.ok(doctorSchedule);
        } catch (IdNotFoundException e) {
            throw new IdNotFoundException("Doctor schedule not found for doctor ID: " + doctorId + " and date: " + date);
        }
    }


    @PutMapping("/update-time-slot")
    public ResponseEntity<String> updateTimeSlotAsBooked(
	        @RequestParam Long doctorId,
	        @RequestParam String date,
	        @RequestParam String timeSlot) {
	    try {
	        doctorScheduleService.updateTimeSlotAsBooked(doctorId, date, timeSlot);
	        return ResponseEntity.ok("Time slot updated successfully");
	    } catch (Exception e) {
	        throw new ConflictException("Error updating time slot: " + e.getMessage());
	    }
}
}