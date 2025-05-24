
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SpeedData {
  timestamps: string[];
  lane_1: number[];
  lane_2: number[];
  lane_3: number[];
}

export default function SpeedEvolutionChart({ data }: { data: SpeedData }) {
  if (!data || !data.timestamps || data.timestamps.length === 0) 
    return <div>No hay datos disponibles</div>;
  
  const chartData = data.timestamps.map((timestamp, index) => {
    const formattedTime = new Date(timestamp).toLocaleTimeString();
    return {
      time: formattedTime,
      lane_1: data.lane_1[index] || 0,
      lane_2: data.lane_2[index] || 0,
      lane_3: data.lane_3[index] || 0
    };
  });

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis label={{ value: 'Velocidad (km/h)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="lane_1" stroke="#4F46E5" name="Carril 1" />
          <Line type="monotone" dataKey="lane_2" stroke="#16A34A" name="Carril 2" />
          <Line type="monotone" dataKey="lane_3" stroke="#DC2626" name="Carril 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}