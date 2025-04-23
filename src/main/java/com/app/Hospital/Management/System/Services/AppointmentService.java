package com.app.Hospital.Management.System.Services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.Hospital.Management.System.entities.Appointment;
import com.app.Hospital.Management.System.entities.AppointmentStatus;
import com.app.Hospital.Management.System.entities.DoctorSchedule;
import com.app.Hospital.Management.System.entities.PatientProfile;
import com.app.Hospital.Management.System.exceptions.ResourceNotFoundException;
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

    @Autowired
    private NotificationService notificationService;

    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatient_PatientId(patientId);
    }

    public List<Appointment> getAppointmentsByPatientEmail(String email) {
        PatientProfile patient = patientProfileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + email));
        return appointmentRepository.findByPatient(patient);
    }

    @Transactional
    public void deleteAppointmentsByPatientId(Long patientId) {
        appointmentRepository.deleteByPatientId(patientId);
    }

    @Transactional
    public Appointment updateAppointmentStatus(Long appointmentId, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));
        appointment.setStatus(newStatus);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public String cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
        return "Appointment cancelled successfully.";
    }

    @Transactional
    public String rescheduleAppointment(Long appointmentId, LocalDate newDate, LocalTime newTime) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        Long doctorId = appointment.getDoctor().getDoctorId();
        DoctorSchedule doctorSchedule = doctorScheduleRepository.findByDoctorIdAndDate(doctorId, newDate)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor schedule not found for doctor ID: " + doctorId + " on date: " + newDate));

        boolean isTimeSlotAvailable = doctorSchedule.getAvailableTimeSlots().stream()
                .anyMatch(slot -> slot.getTimeSlot().equals(newTime) && !slot.isBlocked());
        if (!isTimeSlotAvailable) {
            throw new ResourceNotFoundException("Selected time slot is not available.");
        }

        appointment.getDoctor().setDate(newDate);
        appointment.setAppointmentTime(newTime);
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        appointmentRepository.save(appointment);

        return "Appointment rescheduled successfully.";
    }

    @Transactional
    public String bookAppointment(String patientEmail, Appointment appointment) {
        PatientProfile patient = patientProfileRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + patientEmail));

        Long doctorId = appointment.getDoctor().getDoctorId();
        LocalDate date = appointment.getDoctor().getDate();
        DoctorSchedule doctorSchedule = doctorScheduleRepository.findByDoctorIdAndDate(doctorId, date)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor schedule not found for doctor ID: " + doctorId + " on date: " + date));

        LocalTime appointmentTime = appointment.getAppointmentTime();
        boolean isTimeSlotAvailable = doctorSchedule.getAvailableTimeSlots().stream()
                .anyMatch(slot -> slot.getTimeSlot().equals(appointmentTime) && !slot.isBlocked());
        if (!isTimeSlotAvailable) {
            throw new ResourceNotFoundException("Selected time slot is not available.");
        }

        appointment.setPatient(patient);
        appointment.setDoctor(doctorSchedule);
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        Appointment savedAppointment = appointmentRepository.save(appointment);

        notificationService.createNotificationsForAppointment(savedAppointment.getAppointmentId());

        return "Appointment booked successfully!";
    }
}