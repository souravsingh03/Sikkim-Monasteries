package com.medilink.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "toll_alerts")
public class TollAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tollName;
    private String ambulanceId;
    private String lane;
    private String destination;
    private String patientSeverity;
    private boolean cleared;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public String getTollName() { return tollName; }
    public void setTollName(String tollName) { this.tollName = tollName; }
    public String getAmbulanceId() { return ambulanceId; }
    public void setAmbulanceId(String ambulanceId) { this.ambulanceId = ambulanceId; }
    public String getLane() { return lane; }
    public void setLane(String lane) { this.lane = lane; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getPatientSeverity() { return patientSeverity; }
    public void setPatientSeverity(String patientSeverity) { this.patientSeverity = patientSeverity; }
    public boolean isCleared() { return cleared; }
    public void setCleared(boolean cleared) { this.cleared = cleared; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
