package com.turfzone.repository;

import com.turfzone.model.Turf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TurfRepository extends JpaRepository<Turf, Long> {

    List<Turf> findByTurfNameContainingIgnoreCase(String turfName);

    List<Turf> findByLocationContainingIgnoreCase(String location);

    @Query("SELECT t FROM Turf t WHERE " +
           "LOWER(t.turfName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.location) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Turf> searchByNameOrLocation(@Param("query") String query);

    @Query("SELECT t FROM Turf t WHERE LOWER(t.sportsAvailable) LIKE LOWER(CONCAT('%', :sport, '%'))")
    List<Turf> findBySport(@Param("sport") String sport);

    List<Turf> findByRatingGreaterThanEqual(Double minRating);

    List<Turf> findByPricePerHourBetween(Double minPrice, Double maxPrice);

    List<Turf> findByPricePerHourLessThanEqual(Double maxPrice);

    List<Turf> findAllByOrderByRatingDesc();

    List<Turf> findAllByOrderByPricePerHourAsc();

    List<Turf> findAllByOrderByPricePerHourDesc();
}
