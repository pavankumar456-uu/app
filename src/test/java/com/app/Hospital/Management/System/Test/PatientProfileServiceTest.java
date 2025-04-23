package com.app.Hospital.Management.System.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.app.Hospital.Management.System.Services.PatientProfileService;
import com.app.Hospital.Management.System.entities.PatientProfile;
import com.app.Hospital.Management.System.repositories.AppointmentRepository;
import com.app.Hospital.Management.System.repositories.PatientProfileRepository;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class PatientProfileServiceTest {

    @Mock
    private PatientProfileRepository patientRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PatientProfileService patientProfileService;
    
    private PatientProfile patientProfile;

    @BeforeEach
    void setUp() {
        patientProfile = new PatientProfile();
        patientProfile.setName("John Doe");
        patientProfile.setContactDetails("1234567890");
    }

    @Test
    void testSavePatient() {
        when(patientRepository.save(any(PatientProfile.class))).thenReturn(patientProfile);

        PatientProfile savedPatient = patientProfileService.savePatient(patientProfile);

        verify(patientRepository, times(1)).save(patientProfile);
        assertEquals(patientProfile, savedPatient);
    }

    @Test
    void testGetAllPatients() {
        List<PatientProfile> patients = Arrays.asList(patientProfile);
        when(patientRepository.findAll()).thenReturn(patients);

        List<PatientProfile> result = patientProfileService.getAllPatients();

        verify(patientRepository, times(1)).findAll();
        assertEquals(patients, result);
    }

    @Test
    void testGetPatientById() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(patientProfile));

        Optional<PatientProfile> result = patientProfileService.getPatientById(1L);

        verify(patientRepository, times(1)).findById(1L);
        assertTrue(result.isPresent());
        assertEquals(patientProfile, result.get());
    }

    @Test
    void testDeletePatient() {
        doNothing().when(appointmentRepository).deleteByPatientId(1L);
        doNothing().when(patientRepository).deleteById(1L);

        patientProfileService.deletePatient(1L);

        verify(appointmentRepository, times(1)).deleteByPatientId(1L);
        verify(patientRepository, times(1)).deleteById(1L);
    }
}