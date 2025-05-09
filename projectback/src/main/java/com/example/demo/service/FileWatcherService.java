package com.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.nio.file.*;

@Service
@RequiredArgsConstructor
public class FileWatcherService {

    private final JsonLoader jsonLoader;

    private static final String DIRECTORY_PATH = "../detections";  
    private static final String FILE_NAME = "detections.json";  

    @PostConstruct
    @Async
    public void watchFileChanges() {
        try {
            WatchService watchService = FileSystems.getDefault().newWatchService();
            Path path = Paths.get(DIRECTORY_PATH);
            path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_MODIFY);

            System.out.println("Observando cambios en " + path.toAbsolutePath());

            while (true) {
                WatchKey key = watchService.take();

                for (WatchEvent<?> event : key.pollEvents()) {
                    WatchEvent.Kind<?> kind = event.kind();
                    Path changedFile = (Path) event.context();

                    if (changedFile.toString().equals(FILE_NAME)) {
                        System.out.println("Archivo " + FILE_NAME + " " + (kind == StandardWatchEventKinds.ENTRY_MODIFY ? "modificado" : "creado"));

                        jsonLoader.loadJsonAndSaveToDb(DIRECTORY_PATH + "/" + FILE_NAME);
                        System.out.println("Datos cargados y guardados en la base de datos");
                    }
                }

                boolean valid = key.reset();
                if (!valid) {
                    System.out.println("WatchKey inválido. Terminando observación.");
                    break;
                }
            }

        } catch (IOException | InterruptedException e) {
            System.err.println("Error observando el archivo: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error cargando JSON y guardando en DB: " + e.getMessage());
        }
    }
}
