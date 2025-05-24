
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VehicleData {
  [key: string]: number;
}

export default function VehicleTypeChart({ data }: { data: VehicleData }) {
  if (!data || Object.keys(data).length === 0) return <div>No hay datos disponibles</div>;
  
  const chartData = Object.entries(data).map(([type, percentage]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: Math.round(percentage * 100) / 100
  }));

  const COLORS = ['#4F46E5', '#16A34A', '#DC2626', '#F59E0B'];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}