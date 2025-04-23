package com.app.Hospital.Management.System.Services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.Hospital.Management.System.entities.DoctorSchedule;
import com.app.Hospital.Management.System.entities.ScheduledId;
import com.app.Hospital.Management.System.entities.TimeSlot;
import com.app.Hospital.Management.System.repositories.DoctorScheduleRepository;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DoctorScheduleService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorScheduleService.class);

    @Autowired
    private DoctorScheduleRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public DoctorSchedule saveDoctor(DoctorSchedule doctor) {
        logger.info("Saving doctor schedule: {}", doctor);
        try {
            DoctorSchedule savedDoctor = repo.save(doctor);
            logger.info("Doctor schedule saved successfully: {}", savedDoctor);
            return savedDoctor;
        } catch (Exception e) {
            logger.error("Error saving doctor schedule: {}", doctor, e);
            throw new RuntimeException("Error saving doctor schedule", e);
        }
    }

    public List<DoctorSchedule> getAllDoctors() {
        logger.info("Fetching all doctor schedules");
        try {
            List<DoctorSchedule> doctors = repo.findAll();
            logger.info("Fetched {} doctor schedules", doctors.size());
            return doctors;
        } catch (Exception e) {
            logger.error("Error fetching all doctor schedules", e);
            throw new RuntimeException("Error fetching all doctor schedules", e);
        }
    }

    public Optional<DoctorSchedule> getDoctorSchedule(Long doctorId, LocalDate date) {
        logger.info("Fetching doctor schedule for doctorId: {}, date: {}", doctorId, date);
        try {
            Optional<DoctorSchedule> doctorSchedule = repo.findById(new ScheduledId(doctorId, date));
            if (doctorSchedule.isPresent()) {
                logger.info("Doctor schedule found: {}", doctorSchedule.get());
            } else {
                logger.warn("Doctor schedule not found for doctorId: {}, date: {}", doctorId, date);
            }
            return doctorSchedule;
        } catch (Exception e) {
            logger.error("Error fetching doctor schedule for doctorId: {}, date: {}", doctorId, date, e);
            throw new RuntimeException("Error fetching doctor schedule", e);
        }
    }

    @Transactional
    public String createAvailability(Long doctorId) {
        logger.info("Creating availability for doctorId: {}", doctorId);
        try {
            List<DoctorSchedule> previousAvailabilities = repo.findByDoctorId(doctorId);
            repo.deleteAll(previousAvailabilities);
            logger.info("Deleted previous availabilities for doctorId: {}", doctorId);

            LocalDate startDate = LocalDate.now();
            LocalDate endDate = startDate.plusDays(6);

            List<TimeSlot> timeSlots = new ArrayList<>();
            timeSlots.add(new TimeSlot(LocalTime.of(9, 0), false));
            timeSlots.add(new TimeSlot(LocalTime.of(10, 0), false));
            timeSlots.add(new TimeSlot(LocalTime.of(11, 0), false));
            timeSlots.add(new TimeSlot(LocalTime.of(13, 0), false));
            timeSlots.add(new TimeSlot(LocalTime.of(14, 0), false));
            timeSlots.add(new TimeSlot(LocalTime.of(15, 0), false));

            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                DoctorSchedule sc = new DoctorSchedule(doctorId, date, new ArrayList<>(timeSlots));
                repo.save(sc);
            }
            logger.info("Availability created successfully for doctorId: {}", doctorId);
            return "Availability Created Successfully";
        } catch (Exception e) {
            logger.error("Error creating availability for doctorId: {}", doctorId, e);
            throw new RuntimeException("Error creating availability", e);
        }
    }
}