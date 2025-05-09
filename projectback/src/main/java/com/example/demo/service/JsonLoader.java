package com.example.demo.service;

import com.example.demo.entity.Detection;
import com.example.demo.service.DTO.DetectionsWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JsonLoader {

    private final DetectionService detectionService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void loadJsonAndSaveToDb(String filePath) throws Exception {
        System.out.println("Leyendo el archivo JSON desde: " + filePath);

        DetectionsWrapper wrapper = objectMapper.readValue(new File(filePath), DetectionsWrapper.class);

        System.out.println("Archivo JSON cargado exitosamente.");
        
        List<Detection> detections = wrapper.getDetections().stream()
            .map(d -> {
                System.out.println("Procesando detección con timestamp_ms: " + d.getTimestamp_ms());
                return Detection.builder()
                    .timestampMs(d.getTimestamp_ms())
                    .date(d.getDate())
                    .objectsTotal(safeWriteValueAsString(d.getObjects_total()))
                    .objectsByLane(safeWriteValueAsString(d.getObjects_by_lane()))
                    .avgSpeedByLane(safeWriteValueAsString(d.getAvg_speed_by_lane()))
                    .build();
            })
            .collect(Collectors.toList());

        
        System.out.println("Datos procesados. Guardando en la base de datos...");
        detectionService.saveDetections(detections);

        System.out.println("Detecciones cargadas exitosamente en la base de datos.");
    }

    
    private String safeWriteValueAsString(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            e.printStackTrace();
            return "ayuda"; 
        }
    }
}
