package com.turfzone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TurfZoneApplication {

    public static void main(String[] args) {
        SpringApplication.run(TurfZoneApplication.class, args);
        System.out.println(" TurfZone Backend Started!");
        System.out.println(" API: http://localhost:8080");
    }
}
