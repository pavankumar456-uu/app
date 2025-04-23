package com.app.Hospital.Management.System.Services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.Hospital.Management.System.entities.Appointment;
import com.app.Hospital.Management.System.entities.Notification;
import com.app.Hospital.Management.System.repositories.AppointmentRepository;
import com.app.Hospital.Management.System.repositories.NotificationRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Notification saveNotification(Notification n) {
        logger.info("Saving notification: {}", n);
        try {
            Notification savedNotification = notificationRepository.save(n);
            logger.info("Notification saved successfully: {}", savedNotification);
            return savedNotification;
        } catch (Exception e) {
            logger.error("Error saving notification: {}", n, e);
            throw new RuntimeException("Error saving notification", e);
        }
    }

    public List<Notification> getAllNotifications() {
        logger.info("Fetching all notifications");
        try {
            List<Notification> notifications = notificationRepository.findAll();
            logger.info("Fetched {} notifications", notifications.size());
            return notifications;
        } catch (Exception e) {
            logger.error("Error fetching all notifications", e);
            throw new RuntimeException("Error fetching all notifications", e);
        }
    }

    public Optional<Notification> getNotificationById(Long id) {
        logger.info("Fetching notification by ID: {}", id);
        try {
            Optional<Notification> notification = notificationRepository.findById(id);
            if (notification.isPresent()) {
                logger.info("Notification found: {}", notification.get());
            } else {
                logger.warn("Notification not found with ID: {}", id);
            }
            return notification;
        } catch (Exception e) {
            logger.error("Error fetching notification by ID: {}", id, e);
            throw new RuntimeException("Error fetching notification by ID", e);
        }
    }

    public void deleteNotificationById(Long id) {
        logger.info("Deleting notification by ID: {}", id);
        try {
            notificationRepository.deleteById(id);
            logger.info("Notification deleted successfully by ID: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting notification by ID: {}", id, e);
            throw new RuntimeException("Error deleting notification by ID", e);
        }
    }

    public void createNotificationsForAppointment(Long appointmentID) {
        logger.info("Creating notifications for appointment ID: {}", appointmentID);
        try {
            Notification appointment = appointmentRepository.findByAppointmentId(appointmentID)
                    .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + appointmentID));

            // Create and save a notification for the patient
            Notification patientNotification = new Notification();
            patientNotification.setAppointment(appointment);
            patientNotification.setMessage("Dear Patient, your appointment with Doctor ID " + appointment.getDoctor().getDoctorId() + " is " + appointment.getStatus() + " on the date " + appointment.getDoctor().getDate() + " and the time " + appointment.getAppointmentTime() + " and your appointment ID: " + appointmentID + ".");
            patientNotification.setTimeStamp(LocalDateTime.now());
            notificationRepository.save(patientNotification);

            // Create and save a notification for the doctor
            Notification doctorNotification = new Notification();
            doctorNotification.setAppointment(appointment);
            doctorNotification.setMessage("Dear Doctor, you have an appointment with Patient " + appointment.getPatient().getName() + " on the date " + appointment.getDoctor().getDate() + " and the time " + appointment.getAppointmentTime() + " with Appointment ID: " + appointmentID + ".");
            doctorNotification.setTimeStamp(LocalDateTime.now());
            notificationRepository.save(doctorNotification);

            logger.info("Notifications created successfully for appointment ID: {}", appointmentID);
        } catch (Exception e) {
            logger.error("Error creating notifications for appointment ID: {}", appointmentID, e);
            throw new RuntimeException("Error creating notifications for appointment", e);
        }
    }

    public void generateRemindersForAppointments() {
        logger.info("Generating reminders for appointments");
        try {
            List<Appointment> appointments = appointmentRepository.findAll();

            LocalDate tomorrow = LocalDate.now().plusDays(1);
            List<Appointment> tomorrowAppointments = appointments.stream()
                    .filter(appointment -> appointment.getDoctor().getDate().equals(tomorrow))
                    .collect(Collectors.toList());

            for (Appointment appointment : tomorrowAppointments) {
                // Reminder for the patient
                Notification patientReminder = new Notification();
                patientReminder.setAppointment(appointment);
                patientReminder.setMessage("Dear Patient, this is a reminder for your appointment with Doctor ID " + appointment.getDoctor().getDoctorId() + " scheduled for " + appointment.getDoctor().getDate() + ". Your appointment ID is: " + appointment.getAppointmentId() + ".");
                patientReminder.setTimeStamp(LocalDateTime.now());
                notificationRepository.save(patientReminder);

                // Reminder for the doctor
                Notification doctorReminder = new Notification();
                doctorReminder.setAppointment(appointment);
                doctorReminder.setMessage("Dear Doctor, this is a reminder for your appointment with Patient ID " + appointment.getPatient().getPatientId() + " scheduled for " + appointment.getDoctor().getDate() + ". Appointment ID: " + appointment.getAppointmentId() + ".");
                doctorReminder.setTimeStamp(LocalDateTime.now());
                notificationRepository.save(doctorReminder);
            }

            logger.info("Reminders generated successfully for appointments");
        } catch (Exception e) {
            logger.error("Error generating reminders for appointments", e);
            throw new RuntimeException("Error generating reminders for appointments", e);
        }
    }
}