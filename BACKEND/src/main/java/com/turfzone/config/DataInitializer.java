package com.turfzone.config;

import com.turfzone.model.Turf;
import com.turfzone.repository.TurfRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final TurfRepository turfRepository;

    @Override
    public void run(String... args) {
        if (turfRepository.count() == 0) {
            log.info("Seeding turf data into database...");
            seedTurfs();
            log.info("Turf data seeded successfully!");
        } else {
            log.info("Turf data already exists. Skipping seed.");
        }
    }

    private void seedTurfs() {
        // Turf 1 — Implecity Turf
        turfRepository.save(Turf.builder()
                .turfName("Implecity Turf")
                .sportsAvailable("Cricket,Football,Badminton")
                .pricePerHour(800.0)
                .rating(4.5)
                .location("Nilakkottai, Dindigul")
                .imageUrl(null)
                .build());

        // Turf 2 — Indoor Battle Turf
        turfRepository.save(Turf.builder()
                .turfName("Indoor Battle Turf")
                .sportsAvailable("Cricket,Football")
                .pricePerHour(500.0)
                .rating(3.9)
                .location("Batlagundu, Dindigul")
                .imageUrl(null)
                .build());

        // Turf 3 — Learn Fort
        turfRepository.save(Turf.builder()
                .turfName("Learn Fort")
                .sportsAvailable("Cricket,Football,Badminton,Basketball,Tennis,Volleyball")
                .pricePerHour(1000.0)
                .rating(4.8)
                .location("Balagundu, Dindigul")
                .imageUrl(null)
                .build());
    }
}
