package com.yourapp.auth.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "monasteries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Monastery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String slug; // e.g. "rumtek"
    private String name;
    private String district;
    private String location;
    private String founded;
    private String sect;
    private String imageUrl;

    @Column(length = 1000)
    private String shortDescription;

    @Column(length = 5000)
    private String longDescription;

    @ElementCollection
    @CollectionTable(name = "monastery_highlights", joinColumns = @JoinColumn(name = "monastery_id"))
    @Column(name = "highlight")
    private List<String> highlights;

    private Double latitude;
    private Double longitude;

    private String visitingHours;
    private String entryFee;
    private String bestSeason;
}
