import React, { memo, useState, useEffect } from 'react';
import TrafficVolumeChart from './charts/TrafficVolumeChart';
import LaneDistributionChart from './charts/LaneDistributionChart';
import TimePatternChart from './charts/TimePatternChart';
import SpeedComparisonChart from './charts/SpeedComparisonChart';
import TrafficEvolutionChart from './charts/TrafficEvolutionChart';
import SpeedEvolutionChart from './charts/SpeedEvolutionChart';
import VehicleTypeChart from './charts/VehicleTypeChart';
import { DashboardData, DataStructures, fetchDataStructures } from '../../lib/api';

interface DashboardProps {
  data: DashboardData;
  isLoading?: boolean;
}

const StatisticsPanel = memo(({ structures }: { structures: DataStructures }) => {
  const quickMetrics = structures.arrayData.slice(0, 4);
  const metricLabels = ['Flujo Actual', 'Velocidad Prom.', 'Densidad', 'Eficiencia'];
  
  const recentAlerts = structures.stackData.slice(0, 3);
  const pendingAnalysis = structures.queueData.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {quickMetrics.map((value, index) => (
        <div 
          key={index} 
          className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-2xl shadow-lg border border-rose-100 transform hover:scale-105 transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-rose-600 font-medium">{metricLabels[index]}</p>
              <p className="text-2xl font-bold text-rose-800">{value}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full flex items-center justify-center">
              <span className="text-rose-700 text-xl">
                {index === 0 ? '🚦' : index === 1 ? '⚡' : index === 2 ? '📊' : '✨'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

const Dashboard = memo(({ data, isLoading = false }: DashboardProps) => {
  const [structures, setStructures] = useState<DataStructures>({
    arrayData: [],
    stackData: [],
    queueData: [],
    treeData: { value: null, children: [] }
  });
  const [structuresLoading, setStructuresLoading] = useState(true);

  useEffect(() => {
    const loadStructures = async () => {
      try {
        const structureData = await fetchDataStructures();
        setStructures(structureData);
      } catch (error) {
        console.error('Error cargando estructuras:', error);
      } finally {
        setStructuresLoading(false);
      }
    };

    loadStructures();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-80 shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          ></div>
        ))}
      </div>
    );
  }

  const hasData = data && (
    Object.keys(data.totalVolume?.total || {}).length > 0 ||
    Object.keys(data.volumeByLane || {}).length > 0 ||
    Object.keys(data.hourlyPatterns || {}).length > 0 ||
    Object.keys(data.avgSpeedByLane || {}).length > 0
  );

  if (!hasData) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl text-gray-500">📊</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Sin datos disponibles</h2>
        <p className="text-gray-500">El backend no ha devuelto datos para mostrar.</p>
        <p className="text-sm text-gray-400 mt-2">Verifique la conexión con el servidor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!structuresLoading && (
        <StatisticsPanel structures={structures} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(data.totalVolume?.total || {}).length > 0 && (
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-2xl shadow-lg border border-rose-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-rose-700 text-xl">📊</span>
              </div>
              <h2 className="text-xl font-bold text-rose-800">Volumen Total de Vehículos</h2>
            </div>
            <TrafficVolumeChart data={data.totalVolume} />
          </div>
        )}
        
        {Object.keys(data.volumeByLane || {}).length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-700 text-xl">🛣️</span>
              </div>
              <h2 className="text-xl font-bold text-blue-800">Distribución por Carril</h2>
            </div>
            <LaneDistributionChart data={data.volumeByLane} />
          </div>
        )}
        
        {Object.keys(data.hourlyPatterns || {}).length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-700 text-xl">⏰</span>
              </div>
              <h2 className="text-xl font-bold text-green-800">Patrones Horarios</h2>
            </div>
            <TimePatternChart data={data.hourlyPatterns} />
          </div>
        )}
        
        {Object.keys(data.avgSpeedByLane || {}).length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-700 text-xl">⚡</span>
              </div>
              <h2 className="text-xl font-bold text-purple-800">Velocidad por Carril</h2>
            </div>
            <SpeedComparisonChart data={data.avgSpeedByLane} />
          </div>
        )}
        
        {data.trafficEvolution?.timestamps?.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-amber-700 text-xl">📈</span>
              </div>
              <h2 className="text-xl font-bold text-amber-800">Evolución del Tráfico</h2>
            </div>
            <TrafficEvolutionChart data={data.trafficEvolution} />
          </div>
        )}
        
        {data.speedEvolution?.timestamps?.length > 0 && (
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-2xl shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-teal-700 text-xl">🏎️</span>
              </div>
              <h2 className="text-xl font-bold text-teal-800">Evolución de Velocidad</h2>
            </div>
            <SpeedEvolutionChart data={data.speedEvolution} />
          </div>
        )}
        
        {Object.keys(data.vehicleTypeDominance || {}).length > 0 && (
          <div className="md:col-span-2 bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-2xl shadow-lg border border-violet-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-violet-700 text-xl">🚗</span>
              </div>
              <h2 className="text-xl font-bold text-violet-800">Tipos de Vehículos</h2>
            </div>
            <VehicleTypeChart data={data.vehicleTypeDominance} />
          </div>
        )}
      </div>
    </div>
  );
});

export default Dashboard;