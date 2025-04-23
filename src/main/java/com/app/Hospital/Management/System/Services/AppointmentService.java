package com.app.Hospital.Management.System.Services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.Hospital.Management.System.entities.Appointment;
import com.app.Hospital.Management.System.entities.AppointmentStatus;
import com.app.Hospital.Management.System.entities.DoctorSchedule;
import com.app.Hospital.Management.System.entities.PatientProfile;
import com.app.Hospital.Management.System.repositories.AppointmentRepository;
import com.app.Hospital.Management.System.repositories.DoctorScheduleRepository;
import com.app.Hospital.Management.System.repositories.PatientProfileRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientProfileRepository patientProfileRepository;

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    // Get all appointments for a specific patient by email
    public List<Appointment> getAppointmentsByEmail(String email) {
        PatientProfile patient = patientProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found with email: " + email));
        List<Appointment> appointments = appointmentRepository.findByPatient(patient);
    
        // Ensure doctor schedule and date are fetched
        appointments.forEach(appointment -> {
            appointment.getDoctor().getDate(); // Force fetch of the date field
        });
    
        return appointments;
    }

    // Delete all appointments for a specific patient by email
    public void deleteAppointmentsByEmail(String email) {
        PatientProfile patient = patientProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found with email: " + email));
        appointmentRepository.deleteByPatient(patient);
    }

    // Update appointment status for a specific appointment ID
    public Appointment updateAppointmentStatus(Long appointmentId, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(newStatus);
        return appointmentRepository.save(appointment);
    }

    // Cancel an appointment by appointment ID
    public String cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
        return "Appointment cancelled successfully.";
    }

    // Reschedule an appointment by appointment ID
    public String rescheduleAppointment(Long appointmentId, LocalDate newDate, LocalTime newTime) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.getDoctor().setDate(newDate);
        appointment.setAppointmentTime(newTime);
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        appointmentRepository.save(appointment);
        return "Appointment rescheduled successfully.";
    }

    // Book an appointment
    public String bookAppointment(String email, Appointment appointment) {
        // Validate patient using email
        PatientProfile patient = patientProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found with email: " + email));

        // Validate doctor schedule
        if (appointment.getDoctor() == null || appointment.getDoctor().getDoctorId() == null) {
            throw new RuntimeException("Doctor ID must not be null.");
        }
        Long doctorId = appointment.getDoctor().getDoctorId();
        LocalDate date = appointment.getDoctor().getDate();
        DoctorSchedule doctorSchedule = doctorScheduleRepository.findByDoctorIdAndDate(doctorId, date)
                .orElseThrow(() -> new RuntimeException("Doctor schedule not found for doctor ID: " + doctorId + " on date: " + date));

        // Validate appointment time
        LocalTime appointmentTime = appointment.getAppointmentTime();
        boolean isTimeSlotAvailable = doctorSchedule.getAvailableTimeSlots().stream()
                .anyMatch(slot -> slot.getTimeSlot().equals(appointmentTime) && !slot.isBlocked());
        if (!isTimeSlotAvailable) {
            throw new RuntimeException("Selected time slot is not available.");
        }

        // Save appointment
        appointment.setPatient(patient);
        appointment.setDoctor(doctorSchedule);
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        appointmentRepository.save(appointment);

        return "Appointment booked successfully!";
    }
}