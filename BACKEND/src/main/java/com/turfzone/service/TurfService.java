package com.turfzone.service;

import com.turfzone.exception.ResourceNotFoundException;
import com.turfzone.model.Turf;
import com.turfzone.repository.TurfRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TurfService {

    private final TurfRepository turfRepository;

    public List<Turf> getAllTurfs() {
        return turfRepository.findAll();
    }

    public Turf getTurfById(Long id) {
        return turfRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turf not found with id: " + id));
    }

    public List<Turf> searchTurfs(String query) {
        if (query == null || query.isBlank()) return turfRepository.findAll();
        return turfRepository.searchByNameOrLocation(query.trim());
    }

    public List<Turf> filterBySport(String sport) {
        if (sport == null || sport.isBlank()) return turfRepository.findAll();
        return turfRepository.findBySport(sport.trim());
    }

    public List<Turf> filterByRating(Double minRating) {
        if (minRating == null) return turfRepository.findAll();
        return turfRepository.findByRatingGreaterThanEqual(minRating);
    }

    public List<Turf> filterByPrice(Double minPrice, Double maxPrice) {
        if (minPrice != null && maxPrice != null) {
            return turfRepository.findByPricePerHourBetween(minPrice, maxPrice);
        } else if (maxPrice != null) {
            return turfRepository.findByPricePerHourLessThanEqual(maxPrice);
        } else if (minPrice != null) {
            return turfRepository.findAll().stream()
                    .filter(t -> t.getPricePerHour() >= minPrice)
                    .toList();
        }
        return turfRepository.findAll();
    }

    public List<Turf> getTurfsSortedByRating() {
        return turfRepository.findAllByOrderByRatingDesc();
    }

    public List<Turf> getTurfsSortedByPriceAsc() {
        return turfRepository.findAllByOrderByPricePerHourAsc();
    }

    public List<Turf> getTurfsSortedByPriceDesc() {
        return turfRepository.findAllByOrderByPricePerHourDesc();
    }
}
