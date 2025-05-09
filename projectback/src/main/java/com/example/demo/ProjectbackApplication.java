package com.example.demo;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.demo.service.JsonLoader;

@SpringBootApplication
@RequiredArgsConstructor
public class ProjectbackApplication {

    private final JsonLoader jsonLoader;

    public static void main(String[] args) {
        SpringApplication.run(ProjectbackApplication.class, args);
    }

    @PostConstruct
    public void runOnStartup() throws Exception {
        String filePath = "../detections/detections.json";
        jsonLoader.loadJsonAndSaveToDb(filePath);
        System.out.println("Detections importadas");
    }

   
}
