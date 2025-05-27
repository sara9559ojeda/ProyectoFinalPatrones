
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SpeedData {
  [key: string]: number;
}

export default function SpeedComparisonChart({ data }: { data: SpeedData }) {
  if (!data || Object.keys(data).length === 0) return <div>No hay datos disponibles</div>;
  
  const chartData = Object.entries(data).map(([lane, speed]) => ({
    name: lane.replace('lane_', 'Carril '),
    speed: Math.round(speed * 100) / 100
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Velocidad (km/h)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="speed" fill="#16A34A" name="Velocidad promedio" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}