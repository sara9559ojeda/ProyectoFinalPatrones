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
          <div className="text-center mb-12">
            <div className="animate-float">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <span className="text-white text-5xl">🚦</span>
              </div>
            </div>
            
            <div className="animate-slide-in-top">
              <h1 className="text-6xl font-bold hero-title text-gradient-blue mb-6">
                Sistema de Análisis de Tráfico
              </h1>
              <p className="text-gray-600 text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
                Plataforma profesional de monitoreo y análisis en tiempo real de patrones de tráfico vehicular
              </p>
            </div>
          </div>
        
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
              className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <span className="text-xl">🗑️</span>
              <span className="text-lg">Limpiar Caché</span>
            </button>
          </div>
          
          {lastUpdated && (
            <div className="text-center mb-8 animate-fade-in">
              <div className="professional-card px-8 py-4 rounded-2xl inline-block card-hover-effect">
                <div className="flex items-center space-x-4 text-gray-600">
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
          
          {dashboardData && !error && (
            <div className="max-w-5xl mx-auto mb-12 animate-slide-in-right">
              <div className="status-info rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-2xl">✅</span>
                  </div>
                  <p className="text-blue-800 font-semibold text-lg">
                    Sistema conectado correctamente - Datos cargados desde el backend
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="animate-scale-in">
            <span>holaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span>
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

          {dashboardData && !isLoading && (
            <div className="mt-16 professional-card p-8 rounded-2xl card-hover-effect animate-fade-in">
              <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
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