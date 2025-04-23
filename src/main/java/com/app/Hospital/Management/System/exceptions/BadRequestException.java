package com.app.Hospital.Management.System.exceptions;

public class BadRequestException extends RuntimeException{
	public BadRequestException(String message) {
        super(message);
    }
}
