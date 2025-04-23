package com.app.Hospital.Management.System.Controllers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.app.Hospital.Management.System.Services.AppointmentService;
import com.app.Hospital.Management.System.entities.Appointment;
import com.app.Hospital.Management.System.entities.AppointmentStatus;
import com.app.Hospital.Management.System.exceptions.BadRequestException;
import com.app.Hospital.Management.System.exceptions.ResourceNotFoundException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hospital/appointments")
@Validated
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Book an appointment
    @PostMapping("/book")
    public ResponseEntity<String> bookAppointment(@RequestParam @Valid String email, @Valid @RequestBody Appointment appointment) {
        String result = appointmentService.bookAppointment(email, appointment);
        return ResponseEntity.ok(result);
    }

    // Get all appointments for a specific patient by patient ID
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatientId(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(patientId);
        return ResponseEntity.ok(appointments);
    }

    // Get all appointments for a specific patient by email
    @GetMapping("/patient")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatientEmail(@RequestParam @Valid String email) {
        List<Appointment> appointments = appointmentService.getAppointmentsByPatientEmail(email);
        return ResponseEntity.ok(appointments);
    }

    // Delete all appointments for a specific patient by patient ID
    @DeleteMapping("/patient/{patientId}")
    public ResponseEntity<String> deleteAppointmentsByPatientId(@PathVariable Long patientId) {
        appointmentService.deleteAppointmentsByPatientId(patientId);
        return ResponseEntity.ok("All appointments for patient ID " + patientId + " have been deleted.");
    }

    // Update appointment status for a specific appointment ID
    @PatchMapping("/{appointmentId}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long appointmentId, @RequestBody AppointmentStatus newStatus) {
        Appointment updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, newStatus);
        return ResponseEntity.ok(updatedAppointment);
    }

    // Cancel an appointment by appointment ID
    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long appointmentId) {
        String response = appointmentService.cancelAppointment(appointmentId);
        return ResponseEntity.ok(response);
    }

    // Reschedule an appointment by appointment ID
    @PutMapping("/{appointmentId}/reschedule")
    public ResponseEntity<String> rescheduleAppointment(
            @PathVariable Long appointmentId,
            @RequestBody String newDateTimeString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime newDateTime;
        try {
            newDateTime = LocalDateTime.parse(newDateTimeString.trim(), formatter);
        } catch (DateTimeParseException e) {
            throw new BadRequestException("Invalid date and time format. Expected format: yyyy-MM-dd HH:mm:ss");
        }
        LocalDate newDate = newDateTime.toLocalDate();
        LocalTime newTime = newDateTime.toLocalTime();
        String response = appointmentService.rescheduleAppointment(appointmentId, newDate, newTime);
        return ResponseEntity.ok(response);
    }
}