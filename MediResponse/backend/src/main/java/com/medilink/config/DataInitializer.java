package com.medilink.config;

import com.medilink.model.Hospital;
import com.medilink.model.User;
import com.medilink.repository.HospitalRepository;
import com.medilink.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the database with demo users and hospitals on first run.
 * Spring Boot calls run() automatically after startup.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           HospitalRepository hospitalRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedHospitals();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return; // already seeded

        createUser("AMB-001", "demo123", "Rajesh Kumar",   User.Role.PARAMEDIC,      "Ambulance Unit 4");
        createUser("HOSP-001","demo123", "Dr. Priya Singh", User.Role.HOSPITAL_ADMIN, "Emergency Medicine");
        createUser("TOLL-001","demo123", "Anil Sharma",    User.Role.TOLL_OPERATOR,  "Highway Control");

        System.out.println("✅ Demo users seeded (password: demo123)");
    }

    private void createUser(String employeeId, String password, String name,
                            User.Role role, String department) {
        User user = new User();
        user.setEmployeeId(employeeId);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setName(name);
        user.setRole(role);
        user.setDepartment(department);
        userRepository.save(user);
    }

    private void seedHospitals() {
        if (hospitalRepository.count() > 0) return;

        createHospital("AIIMS Trauma Centre",       4.2, 12, 400, 78,
                "Trauma L1,Cardiology,Neurology,Burns",         "Ring Road, New Delhi",         "011-26593200");
        createHospital("Safdarjung Hospital",        6.8, 17, 350, 62,
                "General Surgery,Orthopaedics,Neurosurgery",   "Ansari Nagar, New Delhi",      "011-26707444");
        createHospital("Apollo Hospitals",           9.1, 22, 250, 55,
                "Cardiology,Vascular Surgery,Oncology",         "Sarita Vihar, New Delhi",      "011-29871090");
        createHospital("Ram Manohar Lohia Hospital", 2.5,  8, 300, 88,
                "General Medicine,Paediatrics,ENT",             "Park Street, New Delhi",       "011-23365525");

        System.out.println("✅ Demo hospitals seeded");
    }

    private void createHospital(String name, double dist, int eta,
                                int cap, int occ, String specialties,
                                String address, String phone) {
        Hospital h = new Hospital();
        h.setName(name);
        h.setDistanceKm(dist);
        h.setEtaMinutes(eta);
        h.setCapacity(cap);
        h.setOccupied(occ);
        h.setSpecialties(specialties);
        h.setAddress(address);
        h.setPhone(phone);
        hospitalRepository.save(h);
    }
}
