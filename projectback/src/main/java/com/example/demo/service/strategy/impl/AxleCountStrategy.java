package com.example.demo.service.strategy.impl;

import com.example.demo.service.strategy.AnalysisStrategy;
import com.example.demo.service.DTO.DetectionJson;
import org.springframework.stereotype.Component;

@Component
public class AxleCountStrategy implements AnalysisStrategy {
    @Override
    public void analyze(DetectionJson detection) {
        // Lógica de conteo de ejes
        System.out.println("Contando ejes en: " + detection.getDate());
    }
}