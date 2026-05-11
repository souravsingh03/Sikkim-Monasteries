package com.medilink.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "active_trips")
public class ActiveTrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ambulanceId;
    private String paramedicName;
    private String patientName;
    private int patientAge;
    private String patientGender;
    private String bloodGroup;

    @Column(length = 1000)
    private String symptoms;
    private String vitals;

    // AI Triage output
    private String severity;
    @Column(length = 1000)
    private String triageSummary;
    @Column(length = 500)
    private String recommendedSpecialists;
    @Column(length = 500)
    private String equipmentNeeded;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Enumerated(EnumType.STRING)
    private TripStatus status;

    private LocalDateTime startTime;

    public enum TripStatus { EN_ROUTE, ARRIVED }

    public Long getId() { return id; }
    public String getAmbulanceId() { return ambulanceId; }
    public void setAmbulanceId(String ambulanceId) { this.ambulanceId = ambulanceId; }
    public String getParamedicName() { return paramedicName; }
    public void setParamedicName(String paramedicName) { this.paramedicName = paramedicName; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public int getPatientAge() { return patientAge; }
    public void setPatientAge(int patientAge) { this.patientAge = patientAge; }
    public String getPatientGender() { return patientGender; }
    public void setPatientGender(String patientGender) { this.patientGender = patientGender; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public String getVitals() { return vitals; }
    public void setVitals(String vitals) { this.vitals = vitals; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getTriageSummary() { return triageSummary; }
    public void setTriageSummary(String triageSummary) { this.triageSummary = triageSummary; }
    public String getRecommendedSpecialists() { return recommendedSpecialists; }
    public void setRecommendedSpecialists(String s) { this.recommendedSpecialists = s; }
    public String getEquipmentNeeded() { return equipmentNeeded; }
    public void setEquipmentNeeded(String e) { this.equipmentNeeded = e; }
    public Hospital getHospital() { return hospital; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }
    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
}
