package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.demo.service.DTO.DetectionJson;

@Service
public class AnalysisService {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalysisService.class);

    public void processDetection(String strategyType, DetectionJson detection) {
        try {
            logger.debug("🔍 Procesando detección tipo: {} con timestamp: {}", 
                        strategyType, detection.getTimestamp_ms());

            switch (strategyType.toLowerCase()) {
                case "vehicle" -> processVehicleDetection(detection);
                case "axle" -> processAxleCount(detection);
                default -> logger.debug("Tipo de análisis no reconocido: {}", strategyType);
            }
            
        } catch (Exception e) {
            logger.error("  Error procesando detección: {}", e.getMessage());
        }
    }
    
    private void processVehicleDetection(DetectionJson detection) {
        try {
            if (detection.getObjects_total() != null) {
                int totalVehicles = detection.getObjects_total().values().stream()
                    .filter(count -> count != null) 
                    .mapToInt(Integer::intValue)
                    .sum();
                logger.debug("Total de vehículos: {}", totalVehicles);
            }
            
            if (detection.getAvg_speed_by_lane() != null) {
                detection.getAvg_speed_by_lane().forEach((lane, speed) -> {
                    if (speed != null) {
                        logger.debug("🛣️ Velocidad en {}: {:.2f} km/h", lane, speed);
                    }
                });
            }
            
        } catch (Exception e) {
            logger.warn("Error en análisis de vehículos: {}", e.getMessage());
        }
    }
    
    private void processAxleCount(DetectionJson detection) {
        logger.debug("Procesando conteo de ejes para timestamp: {}", detection.getTimestamp_ms());
        try {
            if (detection.getObjects_total() != null) {

                int estimatedAxles = detection.getObjects_total().entrySet().stream()
                    .filter(entry -> entry.getValue() != null)
                    .mapToInt(entry -> {
                        String vehicleType = entry.getKey();
                        int count = entry.getValue();

                        int axlesPerVehicle = switch (vehicleType.toLowerCase()) {
                            case "car" -> 2;
                            case "bus" -> 3;
                            case "truck" -> 4;
                            default -> 2;
                        };
                        
                        return count * axlesPerVehicle;
                    })
                    .sum();
                
                logger.debug("Ejes estimados: {}", estimatedAxles);
            }
        } catch (Exception e) {
            logger.warn("Error en conteo de ejes: {}", e.getMessage());
        }
    }
}