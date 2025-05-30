package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Detection;

@Repository
public interface DetectionRepository extends JpaRepository<Detection, Long> {

    @Query(value = "SELECT * FROM detections ORDER BY timestamp_ms DESC LIMIT 50", nativeQuery = true)
    List<Detection> findTop50ByOrderByTimestampMsDesc();

    @Query("SELECT d FROM Detection d WHERE d.timestampMs BETWEEN :startTime AND :endTime ORDER BY d.timestampMs ASC")
    List<Detection> findByTimestampRange(@Param("startTime") Long startTime, @Param("endTime") Long endTime);

    @Query("SELECT d FROM Detection d ORDER BY d.timestampMs ASC")
    List<Detection> findAllOrderByTimestamp();

    @Query("SELECT d FROM Detection d WHERE d.date LIKE :datePattern ORDER BY d.timestampMs ASC")
    List<Detection> findByDatePattern(@Param("datePattern") String datePattern);

    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM Detection d")
    boolean existsAnyDetection();

    @Query(value = "SELECT * FROM detections ORDER BY timestamp_ms DESC LIMIT 1", nativeQuery = true)
    Detection findMostRecentDetection();

    @Query("SELECT d FROM Detection d WHERE d.objectsTotal IS NOT NULL AND d.objectsTotal != '{}' AND d.objectsTotal != '' ORDER BY d.timestampMs DESC")
    List<Detection> findDetectionsWithObjectData();

    @Query("SELECT d FROM Detection d WHERE d.avgSpeedByLane IS NOT NULL AND d.avgSpeedByLane != '{}' AND d.avgSpeedByLane != '' ORDER BY d.timestampMs DESC")
    List<Detection> findDetectionsWithSpeedData();
}