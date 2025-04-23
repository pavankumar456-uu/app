package com.app.Hospital.Management.System.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Email;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long historyId;

    @NotBlank(message = "Diagnosis is mandatory")
    private String diagnosis;

    @NotBlank(message = "Treatment is mandatory")
    private String treatment;

    @NotNull(message = "Date of visit is mandatory")
    private LocalDateTime dateOfVisit;

    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email", nullable = false) // Foreign key to PatientProfile
    @JsonBackReference // Prevent circular reference during serialization
    private PatientProfile patient;
}