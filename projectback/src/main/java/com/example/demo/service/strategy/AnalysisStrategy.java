package com.example.demo.service.strategy;

import com.example.demo.service.DTO.DetectionJson;

public interface AnalysisStrategy {
    void analyze(DetectionJson detection);
}