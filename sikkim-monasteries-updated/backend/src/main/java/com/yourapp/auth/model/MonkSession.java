package com.yourapp.auth.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "monk_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonkSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String monkName;
    private String monastery;
    private String topic; // e.g. "Meditation Basics", "Buddhist Philosophy"

    @Column(length = 1000)
    private String description;

    private LocalDateTime scheduledAt;
    private Integer durationMinutes;
    private String meetLink; // Zoom / Google Meet link
    private String status;   // UPCOMING, LIVE, COMPLETED

    private Integer maxParticipants;
    private Integer registeredCount;
}
