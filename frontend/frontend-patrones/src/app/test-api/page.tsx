"use client";

import { useState, useEffect } from 'react';

interface TestResult {
  success: boolean;
  status?: number;
  statusText?: string;
  hasData?: boolean;
  preview?: string;
  error?: string;
  responseTime?: number;
}

export default function ApiTest() {
  const [testResults, setTestResults] = useState<{[key: string]: TestResult}>({});
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const [overallStatus, setOverallStatus] = useState<'unknown' | 'healthy' | 'degraded' | 'down'>('unknown');

  const endpoints = [
    {
      path: '/detections/analysis/summary',
      name: 'Resumen de Análisis',
      icon: '📊',
      category: 'core',
      description: 'Resumen general del sistema'
    },
    {
      path: '/detections/volume/total',
      name: 'Volumen Total',
      icon: '📈',
      category: 'analytics',
      description: 'Datos de volumen de tráfico'
    },
    {
      path: '/detections/volume/by-lane',
      name: 'Volumen por Carril',
      icon: '🛣️',
      category: 'analytics',
      description: 'Distribución por carriles'
    },
    {
      path: '/detections/lanes/speed',
      name: 'Velocidad por Carril',
      icon: '⚡',
      category: 'analytics',
      description: 'Velocidades promedio'
    },
    {
      path: '/detections/patterns/hourly',
      name: 'Patrones Horarios',
      icon: '⏰',
      category: 'temporal',
      description: 'Distribución temporal'
    },
    {
      path: '/detections/temporal/evolution',
      name: 'Evolución Temporal',
      icon: '📉',
      category: 'temporal',
      description: 'Evolución en el tiempo'
    },
    {
      path: '/detections/temporal/speed',
      name: 'Evolución de Velocidad',
      icon: '🏎️',
      category: 'temporal',
      description: 'Velocidad en el tiempo'
    },
    {
      path: '/detections/vehicle-types/dominance',
      name: 'Tipos de Vehículos',
      icon: '🚗',
      category: 'classification',
      description: 'Dominancia por tipo'
    }
  ];

  const testEndpoint = async (endpoint: typeof endpoints[0]) => {
    const testId = endpoint.path;
    setIsLoading(prev => ({ ...prev, [testId]: true }));
    
    const startTime = performance.now();
    
    try {
      const response = await fetch(`http://localhost:8080/api${endpoint.path}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (response.ok) {
        const data = await response.json();
        const hasData = data && (
          Object.keys(data).length > 0 &&
          !Object.values(data).every(val => 
            val === null || 
            val === undefined || 
            (typeof val === 'object' && Object.keys(val).length === 0) ||
            (Array.isArray(val) && val.length === 0)
          )
        );

        setTestResults(prev => ({ ...prev, [testId]: { 
          success: true, 
          status: response.status,
          hasData,
          preview: JSON.stringify(data).substring(0, 150) + '...',
          responseTime
        }}));
      } else {
        setTestResults(prev => ({ ...prev, [testId]: { 
          success: false, 
          status: response.status,
          statusText: response.statusText,
          responseTime
        }}));
      }
    } catch (err) {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      setTestResults(prev => ({ ...prev, [testId]: { 
        success: false, 
        error: err instanceof Error ? err.message : 'Error de conexión',
        responseTime
      }}));
    } finally {
      setIsLoading(prev => ({ ...prev, [testId]: false }));
    }
  };

  const testAllEndpoints = async () => {
    setOverallStatus('unknown');
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  useEffect(() => {
    const results = Object.values(testResults);
    if (results.length === 0) {
      setOverallStatus('unknown');
      return;
    }

    const successfulTests = results.filter(r => r.success).length;
    const totalTests = results.length;
    const successRate = successfulTests / totalTests;

    if (successRate === 1) {
      setOverallStatus('healthy');
    } else if (successRate > 0.5) {
      setOverallStatus('degraded');
    } else {
      setOverallStatus('down');
    }
  }, [testResults]);

  const getStatusColor = (status: typeof overallStatus) => {
    switch (status) {
      case 'healthy': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'degraded': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'down': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: typeof overallStatus) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'down': return '❌';
      default: return '❓';
    }
  };

  const getStatusText = (status: typeof overallStatus) => {
    switch (status) {
      case 'healthy': return 'Sistema Operativo';
      case 'degraded': return 'Funcionamiento Parcial';
      case 'down': return 'Sistema Inoperativo';
      default: return 'Estado Desconocido';
    }
  };

  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {} as Record<string, typeof endpoints>);

  const categoryNames = {
    core: 'Núcleo del Sistema',
    analytics: 'Análisis de Datos',
    temporal: 'Análisis Temporal',
    classification: 'Clasificación'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl">🔧</span>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Diagnóstico del Sistema API
          </h1>
          <p className="text-gray-600 text-lg">Verificación completa del estado del backend</p>
        </div>

        {/* Estado general */}
        <div className={`professional-card p-6 rounded-xl mb-8 ${getStatusColor(overallStatus)} border-2`}>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-4xl">{getStatusIcon(overallStatus)}</div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{getStatusText(overallStatus)}</h2>
              <p className="text-sm opacity-80">
                {Object.keys(testResults).length > 0 && (
                  `${Object.values(testResults).filter(r => r.success).length} de ${Object.values(testResults).length} servicios operativos`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="text-center mb-8">
          <button 
            className="btn-primary px-8 py-3 text-lg"
            onClick={testAllEndpoints}
            disabled={Object.values(isLoading).some(loading => loading)}
          >
            {Object.values(isLoading).some(loading => loading) ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Ejecutando Diagnóstico...
              </div>
            ) : (
              '🚀 Ejecutar Diagnóstico Completo'
            )}
          </button>
        </div>
        
        {/* Información del sistema */}
        <div className="professional-card p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <span className="mr-2">ℹ️</span>
            Información del Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
              <p className="font-semibold text-blue-800">Frontend</p>
              <p className="text-blue-700">{typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-3 rounded-lg border border-emerald-100">
              <p className="font-semibold text-emerald-800">Backend Esperado</p>
              <p className="text-emerald-700">http://localhost:8080</p>
            </div>
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-3 rounded-lg border border-violet-100">
              <p className="font-semibold text-violet-800">Protocolo</p>
              <p className="text-violet-700">HTTP/CORS</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-100">
              <p className="font-semibold text-amber-800">Endpoints</p>
              <p className="text-amber-700">{endpoints.length} servicios</p>
            </div>
          </div>
        </div>
        
        {/* Resultados por categoría */}
        <div className="space-y-8">
          {Object.entries(groupedEndpoints).map(([category, categoryEndpoints]) => (
            <div key={category} className="professional-card p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {categoryNames[category as keyof typeof categoryNames] || category}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryEndpoints.map((endpoint, index) => {
                  const testId = endpoint.path;
                  const result = testResults[testId];
                  
                  return (
                    <div 
                      key={endpoint.path} 
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{endpoint.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-800">{endpoint.name}</h4>
                            <p className="text-xs text-gray-500">{endpoint.description}</p>
                            <p className="text-xs text-gray-400 font-mono">{endpoint.path}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Estado del endpoint */}
                      <div className="mb-3">
                        {isLoading[testId] ? (
                          <div className="flex items-center text-blue-600">
                            <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                            <span className="text-sm">Verificando...</span>
                          </div>
                        ) : result ? (
                          <div>
                            {result.success ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-emerald-600">
                                    <span className="mr-2">✅</span>
                                    <span className="text-sm font-medium">Operativo</span>
                                  </div>
                                  {result.responseTime && (
                                    <span className="text-xs text-gray-500">{result.responseTime}ms</span>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
                                    <span className="text-emerald-700">Estado: HTTP {result.status}</span>
                                  </div>
                                  <div className={`p-2 rounded border ${
                                    result.hasData 
                                      ? 'bg-blue-50 border-blue-100 text-blue-700' 
                                      : 'bg-amber-50 border-amber-100 text-amber-700'
                                  }`}>
                                    <span>Datos: {result.hasData ? 'Disponibles' : 'Vacíos'}</span>
                                  </div>
                                </div>
                                
                                {result.preview && (
                                  <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 overflow-hidden">
                                    {result.preview}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center text-red-600">
                                  <span className="mr-2">❌</span>
                                  <span className="text-sm font-medium">Error</span>
                                </div>
                                <div className="bg-red-50 p-2 rounded border border-red-100">
                                  <p className="text-xs text-red-700">
                                    {result.error || `HTTP ${result.status} ${result.statusText}`}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">Sin verificar</p>
                        )}
                      </div>
                      
                      {/* Botón individual */}
                      <button 
                        className="w-full bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 text-gray-700 text-sm py-2 px-3 rounded-lg transition-all duration-300 font-medium"
                        onClick={() => testEndpoint(endpoint)}
                        disabled={isLoading[testId]}
                      >
                        {isLoading[testId] ? 'Verificando...' : 'Verificar Endpoint'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Guía de resolución de problemas */}
        <div className="mt-8 professional-card p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <span className="mr-2">💡</span>
            Guía de Resolución de Problemas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-red-400 pl-4">
                <h3 className="font-semibold text-red-700 mb-2">Backend No Disponible</h3>
                <ul className="list-disc pl-5 text-sm text-red-600 space-y-1">
                  <li>Verificar que Spring Boot esté ejecutándose</li>
                  <li>Ejecutar <code className="bg-red-100 px-1 rounded font-mono">mvn spring-boot:run</code></li>
                  <li>Confirmar que el puerto 8080 esté disponible</li>
                  <li>Revisar logs del backend para errores</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-amber-400 pl-4">
                <h3 className="font-semibold text-amber-700 mb-2">Datos Vacíos</h3>
                <ul className="list-disc pl-5 text-sm text-amber-600 space-y-1">
                  <li>Ejecutar el detector Python para generar datos</li>
                  <li>Verificar conexión con MySQL</li>
                  <li>Confirmar que existe el archivo JSON de detecciones</li>
                  <li>Probar endpoint de carga manual de JSON</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-semibold text-blue-700 mb-2">Problemas de CORS</h3>
                <ul className="list-disc pl-5 text-sm text-blue-600 space-y-1">
                  <li>Verificar configuración CORS en Spring Boot</li>
                  <li>Confirmar que el frontend esté en puerto permitido</li>
                  <li>Revisar headers de respuesta del servidor</li>
                  <li>Probar desde navegador diferente</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-emerald-400 pl-4">
                <h3 className="font-semibold text-emerald-700 mb-2">Rendimiento Lento</h3>
                <ul className="list-disc pl-5 text-sm text-emerald-600 space-y-1">
                  <li>Verificar el tamaño de la base de datos</li>
                  <li>Revisar uso de memoria del backend</li>
                  <li>Considerar optimizar consultas SQL</li>
                  <li>Verificar red y latencia de conexión</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}