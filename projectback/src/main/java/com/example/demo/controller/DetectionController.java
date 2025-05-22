package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.DetectionAnalysisService;
import com.example.demo.service.JsonLoader;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/detections")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"})
@RequiredArgsConstructor
public class DetectionController {

    private static final Logger logger = LoggerFactory.getLogger(DetectionController.class);
    private final DetectionAnalysisService analysisService;
    private final JsonLoader jsonLoader;

    

    @GetMapping("/volume/total")
    public ResponseEntity<Map<String, Object>> getTotalVehicleVolume() {
        logger.info("📊 Solicitando volumen total de vehículos");
        try {
            Map<String, Object> result = analysisService.getTotalVehicleVolume();
            logger.info("✅ Volumen total obtenido exitosamente: {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("❌ Error obteniendo volumen total: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error interno del servidor");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", System.currentTimeMillis());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/volume/by-lane")
    public ResponseEntity<Map<String, Map<String, Integer>>> getVehicleVolumeByLane() {
        logger.info("🛣️ Solicitando volumen por carril");
        try {
            Map<String, Map<String, Integer>> result = analysisService.getVehicleVolumeByLane();
            logger.info("✅ Volumen por carril obtenido exitosamente");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("❌ Error obteniendo volumen por carril: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/patterns/hourly")
    public ResponseEntity<Map<String, Integer>> getHourlyPatterns() {
        logger.info("⏰ Solicitando patrones horarios");
        try {
            Map<String, Integer> result = analysisService.getHourlyPatterns();
            logger.info("✅ Patrones horarios obtenidos exitosamente");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("❌ Error obteniendo patrones horarios: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/lanes/speed")
    public ResponseEntity<Map<String, Double>> getAvgSpeedByLane() {
        logger.info("🚗 Solicitando velocidad promedio por carril");
        try {
            Map<String, Double> result = analysisService.getAvgSpeedByLane();
            logger.info("✅ Velocidades por carril obtenidas exitosamente");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("❌ Error obteniendo velocidades por carril: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/lanes/bottlenecks")
    public ResponseEntity<Object[]> getBottlenecks() {
        logger.info("🚧 Solicitando cuellos de botella");
        try {
            Object[] result = analysisService.getBottlenecks();
            logger.info("✅ Cuellos de botella obtenidos exitosamente: {} elementos", result.length);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("❌ Error obteniendo cuellos de botella: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/temporal/evolution")
    public ResponseEntity<Map<String, Object>> getTrafficEvolution() {
        logger.info("📈 Solicitando evolución temporal del tráfico");
        try {
            Map<String, Object> result = analysisService.getTrafficEvolution();
            logger.info("✅ Evolución temporal obtenida exitosamente");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("❌ Error obteniendo evolución temporal: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/temporal/speed")
    public ResponseEntity<Map<String, Object>> getSpeedEvolution() {
        logger.info("🏎️ Solicitando evolución de velocidad");
        try {
            Map<String, Object> result = analysisService.getSpeedEvolution();
            logger.info("✅ Evolución de velocidad obtenida exitosamente");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("❌ Error obteniendo evolución de velocidad: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/vehicle-types/dominance")
    public ResponseEntity<Map<String, Double>> getVehicleTypeDominance() {
        logger.info("🚙 Solicitando dominancia de tipos de vehículos");
        try {
            Map<String, Double> result = analysisService.getVehicleTypeDominance();
            logger.info("✅ Dominancia de tipos obtenida exitosamente");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("❌ Error obteniendo dominancia de tipos: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



}