package com.turfzone.controller;

import com.turfzone.model.Turf;
import com.turfzone.service.TurfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turfs")
@RequiredArgsConstructor
public class TurfController {

    private final TurfService turfService;

    @GetMapping
    public ResponseEntity<List<Turf>> getAllTurfs() {
        return ResponseEntity.ok(turfService.getAllTurfs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Turf> getTurfById(@PathVariable Long id) {
        return ResponseEntity.ok(turfService.getTurfById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Turf>> searchTurfs(
            @RequestParam(value = "q", defaultValue = "") String query) {
        return ResponseEntity.ok(turfService.searchTurfs(query));
    }

    @GetMapping("/filter/sport")
    public ResponseEntity<List<Turf>> filterBySport(
            @RequestParam(value = "sport", defaultValue = "") String sport) {
        return ResponseEntity.ok(turfService.filterBySport(sport));
    }

    @GetMapping("/filter/rating")
    public ResponseEntity<List<Turf>> filterByRating(
            @RequestParam(value = "min", required = false) Double minRating) {
        return ResponseEntity.ok(turfService.filterByRating(minRating));
    }

    @GetMapping("/filter/price")
    public ResponseEntity<List<Turf>> filterByPrice(
            @RequestParam(value = "min", required = false) Double minPrice,
            @RequestParam(value = "max", required = false) Double maxPrice) {
        return ResponseEntity.ok(turfService.filterByPrice(minPrice, maxPrice));
    }
}
