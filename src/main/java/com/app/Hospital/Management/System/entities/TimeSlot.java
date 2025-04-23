package com.app.Hospital.Management.System.entities;

import java.time.LocalTime;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class TimeSlot {
	
	private LocalTime timeSlot;
	
	private boolean isBlocked;

}
