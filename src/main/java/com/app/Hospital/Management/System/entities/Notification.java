package com.app.Hospital.Management.System.entities;

import java.time.LocalDateTime;
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

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name="appointmentId")
    @NotNull(message="Appointment is mandatory")
    private Appointment appointment;

    @NotBlank(message = "Message is mandatory")
    private String message;

    @NotNull(message = "Timestamp is mandatory")
    private LocalDateTime timeStamp;
}