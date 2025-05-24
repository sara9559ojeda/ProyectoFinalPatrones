"use client";

import { useEffect, useState } from 'react';
import { fetchTotalVehicleVolume, TotalVolumeData } from '../../lib/api';
import TrafficVolumeChart from '../components/charts/TrafficVolumeChart';

export default function VolumePage() {
  const [data, setData] = useState<TotalVolumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const volumeData = await fetchTotalVehicleVolume();
        
        if (volumeData && Object.keys(volumeData.total || {}).length > 0) {
          setData(volumeData);
        } else {
          setError('No hay datos de volumen disponibles del backend');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">📊</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-2">Cargando Volumen de Tráfico</h2>
          <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
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
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-gray-400">📊</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Sin Datos Disponibles</h2>
          <p className="text-gray-500">El backend no ha proporcionado datos de volumen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Volumen de Tráfico
          </h1>
          <p className="text-gray-600 text-lg">Análisis detallado del volumen vehicular</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(data.total).map(([type, count], index) => (
            <div 
              key={type}
              className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100 transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 capitalize">{type}s</h3>
                  <p className="text-3xl font-bold text-blue-900">{count}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">
                    {type === 'car' ? '🚗' : type === 'bus' ? '🚌' : '🚛'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-xl border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
            <span className="mr-3">📈</span>
            Distribución por Tipo de Vehículo
          </h2>
          <TrafficVolumeChart data={data} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.keys(data.hourly).length > 0 && (
            <div className="bg-gradient-to-br from-white to-cyan-50 p-6 rounded-2xl shadow-lg border border-cyan-100">
              <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center">
                <span className="mr-2">⏰</span>
                Patrones Horarios
              </h3>
              <div className="space-y-3">
                {Object.entries(data.hourly).map(([hour, count]) => (
                  <div key={hour} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <span className="font-medium text-cyan-700">{hour}</span>
                    <span className="font-bold text-cyan-900">{count} vehículos</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(data.daily).length > 0 && (
            <div className="bg-gradient-to-br from-white to-teal-50 p-6 rounded-2xl shadow-lg border border-teal-100">
              <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center">
                <span className="mr-2">📅</span>
                Patrones Diarios
              </h3>
              <div className="space-y-3">
                {Object.entries(data.daily).map(([day, count]) => (
                  <div key={day} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <span className="font-medium text-teal-700 capitalize">{day}</span>
                    <span className="font-bold text-teal-900">{count} vehículos</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}