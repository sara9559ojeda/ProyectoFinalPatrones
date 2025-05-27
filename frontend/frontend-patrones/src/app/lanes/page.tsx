"use client";

import { useEffect, useState } from 'react';
import { fetchVehicleVolumeByLane, fetchAvgSpeedByLane, LaneVehicleData, SpeedByLaneData } from '../../lib/api';
import LaneDistributionChart from '../components/charts/LaneDistributionChart';
import SpeedComparisonChart from '../components/charts/SpeedComparisonChart';

export default function LanesPage() {
  const [volumeData, setVolumeData] = useState<LaneVehicleData | null>(null);
  const [speedData, setSpeedData] = useState<SpeedByLaneData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [laneVolume, laneSpeed] = await Promise.all([
          fetchVehicleVolumeByLane(),
          fetchAvgSpeedByLane()
        ]);
        
        const hasVolumeData = laneVolume && Object.keys(laneVolume).length > 0;
        const hasSpeedData = laneSpeed && Object.keys(laneSpeed).length > 0;
        
        if (hasVolumeData || hasSpeedData) {
          setVolumeData(hasVolumeData ? laneVolume : null);
          setSpeedData(hasSpeedData ? laneSpeed : null);
        } else {
          setError('No hay datos de carriles disponibles del backend');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos de carriles');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-200 to-green-300 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">🛣️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Cargando Análisis de Carriles</h2>
          <div className="w-8 h-8 border-4 border-emerald-300 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error de Conexión</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!volumeData && !speedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-gray-400">🛣️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Sin Datos de Carriles</h2>
          <p className="text-gray-500">El backend no ha proporcionado datos de análisis de carriles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl">🛣️</span>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Análisis de Carriles
          </h1>
          <p className="text-gray-600 text-lg">Distribución de tráfico y velocidades por carril</p>
        </div>

        {/* Estadísticas generales */}
        {volumeData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Object.entries(volumeData).map(([lane, vehicles], index) => {
              const totalVehicles = Object.values(vehicles).reduce((sum, count) => sum + count, 0);
              const dominantType = Object.entries(vehicles).reduce((max, [type, count]) => 
                count > max.count ? { type, count } : max, { type: '', count: 0 }
              );
              
              return (
                <div 
                  key={lane}
                  className="professional-card p-6 rounded-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 capitalize">
                        {lane.replace('lane_', 'Carril ')}
                      </h3>
                      <p className="text-3xl font-bold text-emerald-700">{totalVehicles}</p>
                      <p className="text-sm text-gray-500">vehículos total</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🚗</span>
                    </div>
                  </div>
                  
                  {dominantType.type && (
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <p className="text-sm text-emerald-700">
                        <span className="font-semibold">Tipo dominante:</span> {dominantType.type} ({dominantType.count})
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Distribución por carril */}
          {volumeData && (
            <div className="professional-card p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">📊</span>
                Distribución de Vehículos por Carril
              </h2>
              <LaneDistributionChart data={volumeData} />
            </div>
          )}

          {/* Velocidades por carril */}
          {speedData && (
            <div className="professional-card p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3">⚡</span>
                Velocidades Promedio por Carril
              </h2>
              <SpeedComparisonChart data={speedData} />
            </div>
          )}
        </div>

        {/* Detalles de velocidad */}
        {speedData && (
          <div className="mt-8 professional-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🏎️</span>
              Detalles de Velocidad por Carril
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(speedData).map(([lane, speed]) => (
                <div key={lane} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-800 capitalize">
                    {lane.replace('lane_', 'Carril ')}
                  </h4>
                  <p className="text-2xl font-bold text-blue-900">{speed.toFixed(1)} km/h</p>
                  <div className="mt-2">
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((speed / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      {speed < 30 ? 'Lento' : speed < 60 ? 'Moderado' : 'Rápido'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}