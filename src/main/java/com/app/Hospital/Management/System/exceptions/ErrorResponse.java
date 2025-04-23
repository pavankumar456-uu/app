package com.app.Hospital.Management.System.exceptions;

import java.time.LocalDateTime;
import lombok.*;
 
@Getter
public class ErrorResponse {

	private String msg;
	private String details;
	private LocalDateTime time;
 
	public ErrorResponse(LocalDateTime time, String msg, String details) {
		this.msg = msg;
		this.details = details;
		this.time = time;
	}

}

 
