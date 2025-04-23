package com.app.Hospital.Management.System.Controllers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.app.Hospital.Management.System.Services.AppointmentService;
import com.app.Hospital.Management.System.entities.Appointment;
import com.app.Hospital.Management.System.entities.AppointmentStatus;
import com.app.Hospital.Management.System.exceptions.BadRequestException;
import com.app.Hospital.Management.System.exceptions.ConflictException;
import com.app.Hospital.Management.System.exceptions.ResourceNotFoundException;
import com.app.Hospital.Management.System.exceptions.ServiceUnavailableException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hospital/appointments")
@Validated
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Book an appointment
    @PostMapping("/book")
    public ResponseEntity<String> bookAppointment(@RequestParam String email, @Valid @RequestBody Appointment appointment) {
        try {
            String result = appointmentService.bookAppointment(email, appointment);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to book appointment: " + e.getMessage());
        } catch (Exception e) {
            throw new ServiceUnavailableException("Service is temporarily unavailable. Please try again later.");
        }
    }

    // Get all appointments for a specific patient by email
    @GetMapping("/patient")
    public ResponseEntity<List<Appointment>> getAppointmentsByEmail(@RequestParam String email) {
        List<Appointment> appointments = appointmentService.getAppointmentsByEmail(email);
        if (appointments.isEmpty()) {
            throw new ResourceNotFoundException("No appointments found for patient email: " + email);
        }
        return ResponseEntity.ok(appointments);
    }

    // Delete all appointments for a specific patient by email
    @DeleteMapping("/patient")
    public ResponseEntity<String> deleteAppointmentsByEmail(@RequestParam String email) {
        try {
            appointmentService.deleteAppointmentsByEmail(email);
            return ResponseEntity.ok("All appointments for patient email " + email + " have been deleted.");
        } catch (Exception e) {
            throw new ResourceNotFoundException("Failed to delete appointments for patient email: " + email);
        }
    }

    // Update appointment status for a specific appointment ID
    @PatchMapping("/{appointmentId}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long appointmentId, @RequestBody AppointmentStatus newStatus) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, newStatus);
            return ResponseEntity.ok(updatedAppointment);
        } catch (Exception e) {
            throw new BadRequestException("Failed to update appointment status: " + e.getMessage());
        }
    }

    // Cancel an appointment by appointment ID
    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long appointmentId) {
        try {
            String response = appointmentService.cancelAppointment(appointmentId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new ConflictException("Failed to cancel appointment: " + e.getMessage());
        }
    }

    // Reschedule an appointment by appointment ID
    @PutMapping("/{appointmentId}/reschedule")
    public ResponseEntity<String> rescheduleAppointment(
            @PathVariable Long appointmentId,
            @RequestBody String newDateTimeString) {
        try {
            newDateTimeString = newDateTimeString.trim();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime newDateTime = LocalDateTime.parse(newDateTimeString, formatter);
            LocalDate newDate = newDateTime.toLocalDate();
            LocalTime newTime = newDateTime.toLocalTime();
            String response = appointmentService.rescheduleAppointment(appointmentId, newDate, newTime);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new BadRequestException("Failed to reschedule appointment: " + e.getMessage());
        }
    }
}