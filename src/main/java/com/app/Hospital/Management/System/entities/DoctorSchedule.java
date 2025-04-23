package com.app.Hospital.Management.System.entities;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctorschedule")
@Data
@AllArgsConstructor
@NoArgsConstructor
@IdClass(ScheduledId.class)
public class DoctorSchedule {

    @Id
    @NotNull(message = "DoctorID is mandatory")
    private Long doctorId;

    @Id
    @NotNull(message = "Date is mandatory")
    @Column(nullable = false)
    private LocalDate date;

    @ElementCollection
    @CollectionTable(name = "TimeSlot", joinColumns = {
        @JoinColumn(name = "doctor_id", referencedColumnName = "doctorId"),
        @JoinColumn(name = "date", referencedColumnName = "date")
    })
    private List<TimeSlot> availableTimeSlots;

    // New field: Name of the doctor
    @NotBlank(message = "Doctor name is mandatory")
    @Column(nullable = false)
    private String doctorName;

    // New field: Specialization of the doctor
    @NotBlank(message = "Specialization is mandatory")
    @Column(nullable = false)
    private String specialization;
}