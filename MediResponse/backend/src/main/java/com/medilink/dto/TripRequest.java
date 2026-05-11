package com.medilink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TripRequest {

    @NotBlank
    private String ambulanceId;
    @NotBlank
    private String paramedicName;
    private String patientName;
    private int patientAge;
    private String patientGender;
    private String bloodGroup;
    @NotBlank
    private String symptoms;
    private String vitals;
    @NotBlank
    private String severity;
    private String triageSummary;
    private String recommendedSpecialists;
    private String equipmentNeeded;
    @NotNull
    private Long hospitalId;

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
    public void setRecommendedSpecialists(String r) { this.recommendedSpecialists = r; }
    public String getEquipmentNeeded() { return equipmentNeeded; }
    public void setEquipmentNeeded(String e) { this.equipmentNeeded = e; }
    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }
}
