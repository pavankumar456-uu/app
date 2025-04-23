package com.app.Hospital.Management.System.Services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.Hospital.Management.System.entities.Appointment;
import com.app.Hospital.Management.System.entities.DoctorSchedule;
import com.app.Hospital.Management.System.entities.Notification;
import com.app.Hospital.Management.System.entities.PatientProfile;
import com.app.Hospital.Management.System.exceptions.ResourceNotFoundException;
import com.app.Hospital.Management.System.repositories.AppointmentRepository;
import com.app.Hospital.Management.System.repositories.DoctorScheduleRepository;
import com.app.Hospital.Management.System.repositories.NotificationRepository;
import com.app.Hospital.Management.System.repositories.PatientProfileRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientProfileRepository patientProfileRepository;

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getNotificationsByPatientEmail(String email) {
        PatientProfile patient = patientProfileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + email));
        return notificationRepository.findByAppointment_Patient(patient);
    }

    public void deleteNotificationById(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification not found with ID: " + id);
        }
        notificationRepository.deleteById(id);
    }

    public void createPatientNotification(Long appointmentID) {
        Appointment appointment = appointmentRepository.findByAppointmentId(appointmentID)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentID));

        Notification patientNotification = new Notification();
        patientNotification.setAppointment(appointment);
        patientNotification.setMessage("Dear " + appointment.getPatient().getName() +
                ", your appointment with Doctor " + appointment.getDoctor().getDoctorName() +
                " is " + appointment.getStatus() + " on the date " + appointment.getDoctor().getDate() +
                " and the time " + appointment.getAppointmentTime() + ". Your appointment ID: " + appointmentID + ".");
        patientNotification.setTimeStamp(LocalDateTime.now());
        notificationRepository.save(patientNotification);
    }

    public void createDoctorNotification(Long appointmentID) {
        Appointment appointment = appointmentRepository.findByAppointmentId(appointmentID)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentID));

        Notification doctorNotification = new Notification();
        doctorNotification.setAppointment(appointment);
        doctorNotification.setMessage("Hi " + appointment.getDoctor().getDoctorName() +
                ", you have an appointment with Patient " + appointment.getPatient().getName() +
                " on the date " + appointment.getDoctor().getDate() +
                " and the time " + appointment.getAppointmentTime() + ". Appointment ID: " + appointmentID + ".");
        doctorNotification.setTimeStamp(LocalDateTime.now());
        notificationRepository.save(doctorNotification);
    }

    public void createNotificationsForAppointment(Long appointmentID) {
        Appointment appointment = appointmentRepository.findById(appointmentID)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentID));

        createPatientNotification(appointmentID);
        createDoctorNotification(appointmentID);
    }

    public void generateRemindersForAppointments() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Appointment> tomorrowAppointments = appointmentRepository.findAll().stream()
                .filter(appointment -> appointment.getDoctor().getDate().equals(tomorrow))
                .collect(Collectors.toList());

        for (Appointment appointment : tomorrowAppointments) {
            Notification patientReminder = new Notification();
            patientReminder.setAppointment(appointment);
            patientReminder.setMessage("Dear Patient, this is a reminder for your appointment with Doctor " +
                    appointment.getDoctor().getDoctorName() + " scheduled for " + appointment.getDoctor().getDate() +
                    ". Your appointment ID is: " + appointment.getAppointmentId() + ".");
            patientReminder.setTimeStamp(LocalDateTime.now());
            notificationRepository.save(patientReminder);

            Notification doctorReminder = new Notification();
            doctorReminder.setAppointment(appointment);
            doctorReminder.setMessage("Dear Doctor, this is a reminder for your appointment with Patient " +
                    appointment.getPatient().getName() + " scheduled for " + appointment.getDoctor().getDate() +
                    ". Appointment ID: " + appointment.getAppointmentId() + ".");
            doctorReminder.setTimeStamp(LocalDateTime.now());
            notificationRepository.save(doctorReminder);
        }
    }
}