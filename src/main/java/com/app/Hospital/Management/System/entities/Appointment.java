package com.app.Hospital.Management.System.entities;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.annotation.Nonnull;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(updatable=false)
    private Long appointmentId;

    @ManyToOne
    @JoinColumn(name="patientId")
    @NotNull(message = "Patient profile is mandatory")
    private PatientProfile patient;
    
    
    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "doctor_id", referencedColumnName = "doctorId"),
        @JoinColumn(name = "date", referencedColumnName = "date")
    })
    @NotNull(message = "Doctor schedule is mandatory")
    private DoctorSchedule doctor;

    
    @NotNull(message = "Appointment time is mandatory")
    @Future(message = "Appointment time must be in the future")
    private LocalTime appointmentTime;
    
    

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Appointment status is mandatory")
    private AppointmentStatus status;
}