package com.turfzone.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "turfs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Turf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "turf_name", nullable = false)
    private String turfName;

    @Column(name = "sports_available", nullable = false, length = 500)
    private String sportsAvailable;

    @Column(name = "price_per_hour", nullable = false)
    private Double pricePerHour;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "location")
    private String location;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
