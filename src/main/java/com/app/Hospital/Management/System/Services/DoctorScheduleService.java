package com.app.Hospital.Management.System.Services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

    /**
     * Save a new doctor schedule.
     */
    public DoctorSchedule saveDoctor(DoctorSchedule doctor) {
        logger.info("Saving doctor schedule: {}", doctor);
        try {
            // Validate required fields
            if (doctor.getDoctorName() == null || doctor.getDoctorName().isEmpty()) {
                throw new IllegalArgumentException("Doctor name is mandatory");
            }
            if (doctor.getSpecialization() == null || doctor.getSpecialization().isEmpty()) {
                throw new IllegalArgumentException("Specialization is mandatory");
            }

            DoctorSchedule savedDoctor = repo.save(doctor);
            logger.info("Doctor schedule saved successfully: {}", savedDoctor);
            return savedDoctor;
        } catch (Exception e) {
            logger.error("Error saving doctor schedule: {}", doctor, e);
            throw new RuntimeException("Error saving doctor schedule", e);
        }
    }

    /**
     * Get all doctor schedules.
     */
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

    /**
     * Get a specific doctor schedule by doctor ID and date.
     */
    public DoctorSchedule getDoctorScheduleByIdAndDate(Long doctorId, String date) {
        logger.info("Fetching doctor schedule for doctorId: {}, date: {}", doctorId, date);
        try {
            LocalDate parsedDate = LocalDate.parse(date);
            Optional<DoctorSchedule> doctorSchedule = repo.findByDoctorIdAndDate(doctorId, parsedDate);
            if (doctorSchedule.isPresent()) {
                logger.info("Doctor schedule found: {}", doctorSchedule.get());
                return doctorSchedule.get();
            } else {
                logger.warn("Doctor schedule not found for doctorId: {}, date: {}", doctorId, parsedDate);
                throw new RuntimeException("Doctor schedule not found");
            }
        } catch (Exception e) {
            logger.error("Error fetching doctor schedule for doctorId: {}, date: {}", doctorId, date, e);
            throw new RuntimeException("Error fetching doctor schedule", e);
        }
    }

    /**
     * Create availability for a doctor by ID.
     */
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
                DoctorSchedule sc = new DoctorSchedule(doctorId, date, new ArrayList<>(timeSlots), "Default Name", "Default Specialization");
                repo.save(sc);
            }
            logger.info("Availability created successfully for doctorId: {}", doctorId);
            return "Availability Created Successfully";
        } catch (Exception e) {
            logger.error("Error creating availability for doctorId: {}", doctorId, e);
            throw new RuntimeException("Error creating availability", e);
        }
    }


    @Transactional
public void updateTimeSlotAsBooked(Long doctorId, String date, String timeSlot) {
    logger.info("Updating time slot as booked for doctorId: {}, date: {}, timeSlot: {}", doctorId, date, timeSlot);
    try {
        LocalDate parsedDate = LocalDate.parse(date);
        Optional<DoctorSchedule> doctorScheduleOptional = repo.findByDoctorIdAndDate(doctorId, parsedDate);

        if (doctorScheduleOptional.isPresent()) {
            DoctorSchedule doctorSchedule = doctorScheduleOptional.get();

            // Find the matching time slot and mark it as booked
            doctorSchedule.getAvailableTimeSlots().forEach(slot -> {
                if (slot.getTimeSlot().toString().equals(timeSlot)) {
                    slot.setBlocked(true);
                }
            });

            // Save the updated schedule back to the database
            repo.save(doctorSchedule);
            logger.info("Time slot updated successfully for doctorId: {}, date: {}, timeSlot: {}", doctorId, date, timeSlot);
        } else {
            logger.warn("Doctor schedule not found for doctorId: {}, date: {}", doctorId, parsedDate);
            throw new RuntimeException("Doctor schedule not found");
        }
    } catch (Exception e) {
        logger.error("Error updating time slot for doctorId: {}, date: {}, timeSlot: {}", doctorId, date, timeSlot, e);
        throw new RuntimeException("Error updating time slot", e);
    }
}
}