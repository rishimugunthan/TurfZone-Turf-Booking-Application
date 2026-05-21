package com.turfzone.service;

import com.turfzone.dto.BookingRequest;
import com.turfzone.dto.BookingResponse;
import com.turfzone.exception.ResourceNotFoundException;
import com.turfzone.model.Booking;
import com.turfzone.model.Turf;
import com.turfzone.repository.BookingRepository;
import com.turfzone.repository.TurfRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TurfRepository turfRepository;
    private final EmailService emailService;

    public BookingResponse createBooking(BookingRequest request) {
        Turf turf = turfRepository.findById(request.getTurfId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Turf not found with id: " + request.getTurfId())
                );

        Booking booking = Booking.builder()
                .userName(request.getUserName())
                .email(request.getEmail())
                .turf(turf)
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created: #{} for turf '{}' by {}",
                savedBooking.getBookingId(), turf.getTurfName(), savedBooking.getEmail());

        emailService.sendBookingConfirmation(savedBooking);

        return new BookingResponse(
                savedBooking.getBookingId(),
                savedBooking.getUserName(),
                savedBooking.getEmail(),
                turf.getTurfName(),
                turf.getLocation(),
                turf.getPricePerHour(),
                savedBooking.getBookingDate(),
                savedBooking.getBookingTime()
        );
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByEmail(email);
    }
}
