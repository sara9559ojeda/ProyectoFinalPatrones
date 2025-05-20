package com.example.demo.service;

import com.example.demo.service.strategy.AnalysisStrategy;
import com.example.demo.service.strategy.AnalysisStrategyFactory;
import com.example.demo.service.DTO.DetectionJson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalysisService {
    
    @Autowired
    private AnalysisStrategyFactory factory;

    public void processDetection(String strategyType, DetectionJson detection) {
        AnalysisStrategy strategy = factory.getStrategy(strategyType);
        strategy.analyze(detection);
    }
}