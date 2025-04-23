package com.app.Hospital.Management.System.entities;

import java.io.Serializable;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledId implements Serializable {

	private static final long serialVersinUID=1L;
	
	private Long doctorId;
	private LocalDate date;
}
