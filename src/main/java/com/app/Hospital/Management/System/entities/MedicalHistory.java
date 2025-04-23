package com.app.Hospital.Management.System.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class MedicalHistory {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long historyId;

    @ManyToOne
    @JoinColumn(name="patientId", nullable = false)
    @JsonBackReference
    @NotNull(message = "Patient profile is mandatory")
    private PatientProfile patient;

    @NotBlank(message = "Diagnosis is mandatory")
    private String diagnosis;

    @NotBlank(message = "Treatment is mandatory")
    private String treatment;

    @NotNull(message = "Date of visit is mandatory")
    private LocalDateTime dateOfVisit;
}