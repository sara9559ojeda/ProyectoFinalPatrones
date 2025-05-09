package com.example.demo.service;

import com.example.demo.entity.Detection;
import com.example.demo.repository.DetectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DetectionService {

    private final DetectionRepository detectionRepository;

    public void saveDetections(List<Detection> detections) {
        detectionRepository.saveAll(detections);
    }
}
