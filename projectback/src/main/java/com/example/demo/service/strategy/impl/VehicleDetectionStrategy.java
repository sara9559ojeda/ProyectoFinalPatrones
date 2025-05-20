package com.example.demo.service.strategy.impl;

import com.example.demo.service.strategy.AnalysisStrategy;
import com.example.demo.service.DTO.DetectionJson;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Component
public class VehicleDetectionStrategy implements AnalysisStrategy {
    @Override
    public void analyze(DetectionJson detection) {
        // Usar RestTemplate para llamar a la API de Python
        RestTemplate restTemplate = new RestTemplate();
        String pythonApiUrl = "http://localhost:5000/analyze";
        
        ResponseEntity<String> response = restTemplate.postForEntity(
            pythonApiUrl,
            detection.getObjects_total(),
            String.class
        );
        
        System.out.println("Respuesta de Python: " + response.getBody());
    }
}