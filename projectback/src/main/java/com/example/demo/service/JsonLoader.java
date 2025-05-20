package com.example.demo.service;

import com.example.demo.service.DTO.DetectionJson;
import com.example.demo.entity.Detection;
import com.example.demo.service.DTO.DetectionsWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JsonLoader {

    private static final Logger logger = LoggerFactory.getLogger(JsonLoader.class);

    private final DetectionService detectionService;
    private final AnalysisService analysisService;
    private final ObjectMapper objectMapper;

    @Value("${app.detections.file-path}")
    private String filePath;

    public void loadJsonAndSaveToDb() throws Exception {
        File jsonFile = new File(filePath);
        if (!jsonFile.exists()) {
            logger.error("El archivo JSON no existe: {}", filePath);
            throw new IllegalArgumentException("El archivo JSON no existe: " + filePath);
        }
        try {
            logger.info("Leyendo el archivo JSON desde: {}", filePath);

            DetectionsWrapper wrapper = objectMapper.readValue(jsonFile, DetectionsWrapper.class);

            logger.info("Archivo JSON cargado exitosamente.");

            List<DetectionJson> detectionsJson = wrapper.getDetections();
            if (detectionsJson == null || detectionsJson.isEmpty()) {
                logger.warn("No se encontraron detecciones en el archivo JSON.");
                return;
            }

            List<Detection> detections = detectionsJson.stream()
                .map(d -> {
                    try {
                        logger.debug("Procesando detección con timestamp_ms: {}", d.getTimestamp_ms());
                        analysisService.processDetection("vehicle", d);
                        return Detection.builder()
                            .timestampMs(d.getTimestamp_ms())
                            .date(d.getDate())
                            .objectsTotal(safeWriteValueAsString(d.getObjects_total()))
                            .objectsByLane(safeWriteValueAsString(d.getObjects_by_lane()))
                            .avgSpeedByLane(safeWriteValueAsString(d.getAvg_speed_by_lane()))
                            .build();
                    } catch (Exception e) {
                        logger.error("Error procesando detección con timestamp_ms {}: {}", d.getTimestamp_ms(), e.getMessage());
                        return null;
                    }
                })
                .filter(d -> d != null)
                .collect(Collectors.toList());

            if (detections.isEmpty()) {
                logger.warn("No se procesó ninguna detección válida.");
                return;
            }

            logger.info("Datos procesados. Guardando en la base de datos...");
            detectionService.saveDetections(detections);

            logger.info("Detecciones cargadas exitosamente en la base de datos.");
        } catch (IllegalArgumentException e) {
            logger.error("Archivo JSON inválido: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error al cargar el archivo JSON: {}", e.getMessage(), e);
            throw e;
        }
    }

    private String safeWriteValueAsString(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            logger.error("Error al convertir objeto a JSON: {}", e.getMessage());
            return "{}";
        }
    }
}
