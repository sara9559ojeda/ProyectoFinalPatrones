"use client";

import { useEffect, useState, useCallback } from 'react';
import Dashboard from '../components/Dashboard';
import { fetchData, DashboardData, cache } from '../../lib/api';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchData(forceRefresh);
      
      const hasRealData = data && (
        Object.keys(data.totalVolume?.total || {}).length > 0 ||
        Object.keys(data.volumeByLane || {}).length > 0 ||
        Object.keys(data.hourlyPatterns || {}).length > 0 ||
        Object.keys(data.avgSpeedByLane || {}).length > 0
      );

      if (hasRealData) {
        setDashboardData(data);
        setLastUpdated(new Date());
        setConnectionAttempts(0);
      } else {
        setError('El backend no devolvió datos válidos');
        setConnectionAttempts(prev => prev + 1);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el backend');
      setConnectionAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 60000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, fetchDashboardData]);

  const handleRetry = useCallback(() => {
    setConnectionAttempts(0);
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);
  
  const handleClearCache = useCallback(() => {
    cache.clear();
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  return (
    <div className="hero-background-parallax">
      <div className="hero-overlay"></div>
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section con imagen de fondo */}
          <div className="text-center mb-12">
            <div className="animate-float">
              <div className="w-28 h-28 bg-gradient-to-br from-amber-600 to-orange-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <span className="text-white text-5xl">🚦</span>
              </div>
            </div>
            
            <div className="animate-slide-in-top">
              <h1 className="text-6xl font-bold hero-title text-gradient-ocre mb-6">
                Sistema de Análisis de Tráfico
              </h1>
              <p className="text-slate-700 text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
                Plataforma profesional de monitoreo y análisis en tiempo real de patrones de tráfico vehicular
              </p>
            </div>
          </div>
          
          {/* Controles mejorados */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-slide-in-bottom">
            <button 
              onClick={() => fetchDashboardData(true)}
              disabled={isLoading}
              className="btn-primary flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg">Actualizando...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🔄</span>
                  <span className="text-lg">Actualizar Datos</span>
                </>
              )}
            </button>
            
            <button 
              onClick={toggleAutoRefresh}
              className={`${autoRefresh ? 'btn-secondary' : 'btn-primary'} flex items-center space-x-3 transform hover:scale-105 transition-all duration-300`}
            >
              <span className="text-xl">{autoRefresh ? '⏸️' : '▶️'}</span>
              <span className="text-lg">{autoRefresh ? 'Pausar Auto-actualización' : 'Activar Auto-actualización'}</span>
            </button>
            
            <button 
              onClick={handleClearCache}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <span className="text-xl">🗑️</span>
              <span className="text-lg">Limpiar Caché</span>
            </button>
          </div>
          
          {/* Estado de actualización mejorado */}
          {lastUpdated && (
            <div className="text-center mb-8 animate-fade-in">
              <div className="professional-card px-8 py-4 rounded-2xl inline-block card-hover-effect">
                <div className="flex items-center space-x-4 text-slate-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-200 rounded-full flex items-center justify-center">
                    <span className="text-emerald-700 text-xl">⏰</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Última actualización: {lastUpdated.toLocaleTimeString()}</p>
                    {autoRefresh && (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-emerald-700 font-medium">Auto-actualización activa</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Notificaciones de error mejoradas */}
          {error && (
            <div className="max-w-5xl mx-auto mb-12 animate-slide-in-left">
              <div className="status-error rounded-2xl p-8 shadow-2xl">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 text-3xl">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-red-800 mb-3">Error de Conexión con el Backend</h3>
                    <p className="text-red-700 mb-6 text-lg">{error}</p>
                    
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={handleRetry}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        🔄 Reintentar Conexión
                      </button>
                      
                      <a 
                        href="/test-api"
                        className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-3 px-6 rounded-xl border border-red-300 transition-all duration-300 hover:shadow-md"
                      >
                        🔧 Diagnóstico del Sistema
                      </a>
                    </div>
                    
                    {connectionAttempts >= 3 && (
                      <div className="mt-6 p-6 bg-amber-50 border border-amber-200 rounded-xl">
                        <h4 className="font-semibold text-amber-800 mb-4 text-lg">💡 Pasos para resolver el problema:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-amber-700">
                          <div>
                            <p className="font-medium text-lg mb-3">Backend:</p>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>Verificar que Spring Boot esté ejecutándose</li>
                              <li>Ejecutar <code className="bg-amber-100 px-2 py-1 rounded font-mono">mvn spring-boot:run</code></li>
                              <li>Confirmar puerto 8080 disponible</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-lg mb-3">Datos:</p>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>Ejecutar detector Python</li>
                              <li>Verificar base de datos MySQL</li>
                              <li>Confirmar JSON de detecciones</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Notificación de éxito mejorada */}
          {dashboardData && !error && (
            <div className="max-w-5xl mx-auto mb-12 animate-slide-in-right">
              <div className="status-success rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-2xl">✅</span>
                  </div>
                  <p className="text-green-800 font-semibold text-lg">
                    Sistema conectado correctamente - Datos cargados desde el backend
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Dashboard mejorado */}
          <div className="animate-scale-in">
            <Dashboard 
              data={dashboardData || {
                totalVolume: { hourly: {}, daily: {}, total: {} },
                volumeByLane: {},
                hourlyPatterns: {},
                avgSpeedByLane: {},
                bottlenecks: [],
                trafficEvolution: { timestamps: [], car: [], bus: [], truck: [] },
                speedEvolution: { timestamps: [], lane_1: [], lane_2: [], lane_3: [] },
                vehicleTypeDominance: {}
              }} 
              isLoading={isLoading} 
            />
          </div>

          {/* Estadísticas del sistema mejoradas */}
          {dashboardData && !isLoading && (
            <div className="mt-16 professional-card p-8 rounded-2xl card-hover-effect animate-fade-in">
              <h3 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-700 text-xl">📊</span>
                </div>
                Estado del Sistema
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 card-hover-effect">
                  <p className="text-3xl font-bold text-blue-700">
                    {Object.keys(dashboardData.totalVolume?.total || {}).length}
                  </p>
                  <p className="text-blue-600 font-medium">Tipos de Vehículos</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-200 card-hover-effect">
                  <p className="text-3xl font-bold text-emerald-700">
                    {Object.keys(dashboardData.volumeByLane || {}).length}
                  </p>
                  <p className="text-emerald-600 font-medium">Carriles Monitoreados</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl border border-violet-200 card-hover-effect">
                  <p className="text-3xl font-bold text-violet-700">
                    {Object.keys(dashboardData.hourlyPatterns || {}).length}
                  </p>
                  <p className="text-violet-600 font-medium">Horas Registradas</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl border border-orange-200 card-hover-effect">
                  <p className="text-3xl font-bold text-orange-700">
                    {dashboardData.trafficEvolution?.timestamps?.length || 0}
                  </p>
                  <p className="text-orange-600 font-medium">Puntos Temporales</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}