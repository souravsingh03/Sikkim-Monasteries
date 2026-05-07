package com.yourapp.auth.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "qr_stamps")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrStamp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "monastery_id", nullable = false)
    private Monastery monastery;

    @Column(nullable = false)
    private LocalDateTime stampedAt;

    private String qrCode; // unique code per monastery for verification
}
