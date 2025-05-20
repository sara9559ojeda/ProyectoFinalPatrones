package com.example.demo.service.strategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
public class AnalysisStrategyFactory {
    
    @Autowired
    private ApplicationContext context;

    public AnalysisStrategy getStrategy(String strategyName) {
        return context.getBean(strategyName + "Strategy", AnalysisStrategy.class);
    }
}