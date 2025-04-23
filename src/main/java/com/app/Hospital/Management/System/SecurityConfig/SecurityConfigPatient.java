package com.app.Hospital.Management.System.SecurityConfig;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.app.Hospital.Management.System.entities.User;
import com.app.Hospital.Management.System.repositories.PatientProfileRepository;
import com.app.Hospital.Management.System.repositories.UserRepository;

@Service
public class SecurityConfigPatient implements UserDetailsService {
	@Autowired
	UserRepository userRepo;
	@Autowired
	PatientProfileRepository patRepo;

	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		Optional<User> u=null;
		//PatientProfile p=null;
		String role="";
		List<GrantedAuthority> li;
		if(username.contains("@doctor.com"))
		{	
			u=userRepo.findByEmail(username);
			role="ROLE_DOCTOR"+"";
			li=List.of(new SimpleGrantedAuthority(role));
			System.out.println(u.get().getPassword());
			return new org.springframework.security.core.userdetails.User(u.get().getEmail(), u.get().getPassword(),li);
		}
		else {
			//p=patRepo.findByEmail(username);
			u=userRepo.findByEmail(username);
			role="ROLE_PATIENT"+"";
			li=List.of(new SimpleGrantedAuthority(role));
			return new org.springframework.security.core.userdetails.User(u.get().getEmail(), u.get().getPassword(),li);
		}
	
		//return new org.springframework.security.core.userdetails.User(d.getEmail(), d.getPassword(),li);
	}

	
	

}
