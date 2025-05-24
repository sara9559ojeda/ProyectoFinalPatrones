import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  total?: Record<string, number>;
}

export default function TrafficVolumeChart({ data }: { data: ChartData }) {
  // Solo mostrar si hay datos reales del backend
  if (!data || !data.total || Object.keys(data.total).length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gray-400 text-2xl">📊</span>
          </div>
          <p className="text-gray-500 font-medium">Sin datos del backend</p>
          <p className="text-gray-400 text-sm">Esperando datos del servidor...</p>
        </div>
      </div>
    );
  }
  
  const chartData = Object.entries(data.total).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    fill: type === 'car' ? '#f9a8d4' : type === 'bus' ? '#93c5fd' : '#fbbf24'
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/50">
          <p className="font-medium text-gray-800">{`${label}`}</p>
          <p className="text-sm" style={{ color: payload[0].fill }}>
            {`Cantidad: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.7} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="count" 
            fill="#f9a8d4"
            name="Cantidad"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}