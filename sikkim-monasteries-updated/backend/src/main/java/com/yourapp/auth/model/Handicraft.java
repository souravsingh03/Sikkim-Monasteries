package com.yourapp.auth.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "handicrafts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Handicraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String artisan;
    private String monastery; // which monastery this craft is associated with
    private String category;  // e.g. Thangka, Wooden Carving, Textile

    @Column(length = 1000)
    private String description;

    private Double price;
    private String imageUrl;
    private boolean available;
}
