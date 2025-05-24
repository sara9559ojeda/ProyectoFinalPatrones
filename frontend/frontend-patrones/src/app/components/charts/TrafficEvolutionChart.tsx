
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrafficData {
  timestamps: string[];
  car: number[];
  bus: number[];
  truck: number[];
}

export default function TrafficEvolutionChart({ data }: { data: TrafficData }) {
  if (!data || !data.timestamps || data.timestamps.length === 0) 
    return <div>No hay datos disponibles</div>;
  
  const chartData = data.timestamps.map((timestamp, index) => {
    const formattedTime = new Date(timestamp).toLocaleTimeString();
    return {
      time: formattedTime,
      car: data.car[index] || 0,
      bus: data.bus[index] || 0,
      truck: data.truck[index] || 0
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
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="car" stroke="#4F46E5" name="Carros" />
          <Line type="monotone" dataKey="bus" stroke="#16A34A" name="Buses" />
          <Line type="monotone" dataKey="truck" stroke="#DC2626" name="Camiones" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}