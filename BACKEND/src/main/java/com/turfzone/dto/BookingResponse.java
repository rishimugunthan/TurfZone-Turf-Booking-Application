package com.turfzone.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingResponse {

    private Long bookingId;
    private String userName;
    private String email;
    private String turfName;
    private String location;
    private Double pricePerHour;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String message;

    public BookingResponse(Long bookingId, String userName, String email,
                           String turfName, String location, Double pricePerHour,
                           LocalDate bookingDate, LocalTime bookingTime) {
        this.bookingId = bookingId;
        this.userName = userName;
        this.email = email;
        this.turfName = turfName;
        this.location = location;
        this.pricePerHour = pricePerHour;
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
        this.message = "SUCCESSFULLY BOOKED! Confirmation sent to " + email;
    }
}
