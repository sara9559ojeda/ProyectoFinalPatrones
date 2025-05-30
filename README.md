# 🚦 ProyectoFinalPatrones - Sistema de Monitoreo de Tráfico

Este proyecto implementa un sistema de monitoreo de tráfico que utiliza modelos de visión por computadora para analizar videos en tiempo real. La solución está compuesta por un backend en Java (Spring Boot), un frontend en Next.js y procesamiento de datos con Python.

---

## 🧠 Funcionalidad Principal

- Análisis de tráfico a partir de videos en la carpeta `data/`.
- Detección y seguimiento de vehículos mediante modelos YOLO (`ultralytics`).
- Visualización en tiempo real a través de una interfaz web moderna.
- Backend REST para la gestión de datos y estadísticas.

---

## 📁 Estructura del Proyecto
ProyectoFinalPatrones/
├── backend/ # Proyecto Spring Boot
├── frontend/ # Interfaz web en Next.js
├── detections/ # Procesamiento con Ultralytics
└── README.md # Este archivo


## python
pip install ultralytics
## Version backend
Spring Boot versión 3.4.5
## Correr el backend
mvn spring-boot:run
## Versiones frontend
Next.js ^15.3.2
React ^18.2.0
Tailwind css ^3.4.1
Typescript 5.3.3
## Correr frontend
npm install
npm run dev
