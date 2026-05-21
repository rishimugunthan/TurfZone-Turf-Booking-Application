package com.turfzone.service;

import com.turfzone.model.Booking;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendBookingConfirmation(Booking booking) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("rishimugunthan5@gmail.com");
            message.setTo(booking.getEmail());
            message.setSubject("🏟️ TurfZone - Booking Confirmed! [#" + booking.getBookingId() + "]");
            message.setText(buildEmailBody(booking));

            mailSender.send(message);
            log.info("Confirmation email sent to: {}", booking.getEmail());

        } catch (Exception e) {
            log.error("Failed to send confirmation email to {}: {}", booking.getEmail(), e.getMessage());
        }
    }
    private String buildEmailBody(Booking booking) {
        return """
        	    Hi %s,

        	    Your turf has been booked successfully.

        	    Booking Details:
        	    Booking ID : #%d
        	    Turf       : %s
        	    Location   : %s
        	    Date       : %s
        	    Time Slot  : %s
        	    Price      : ₹%.0f per hour

        	    Please arrive a few minutes before your scheduled time.

        	    If you need any help regarding your booking, feel free to contact us.

        	    Thank you for choosing TurfZone.
        	    
        	    Have a great game!
                
                — Team TurfZone
                """.formatted(
                booking.getUserName(),
                booking.getBookingId(),
                booking.getTurf().getTurfName(),
                booking.getTurf().getLocation(),
                booking.getBookingDate().toString(),
                booking.getBookingTime().toString(),
                booking.getTurf().getPricePerHour()
        );
    }
}
