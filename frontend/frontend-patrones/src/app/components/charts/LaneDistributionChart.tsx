
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataItem {
  name: string;
  [key: string]: string | number;
}

interface VehicleCounts {
  [key: string]: number;
}

interface LaneDistributionData {
  [lane: string]: VehicleCounts;
}

export default function LaneDistributionChart({ data }: { data: LaneDistributionData }) {
  if (!data || Object.keys(data).length === 0) return <div>No hay datos disponibles</div>;
  
  const chartData = Object.entries(data).map(([lane, vehicles]) => {
    const laneData: ChartDataItem = {
      name: lane.replace('lane_', 'Carril '),
    };
    
    if (vehicles && typeof vehicles === 'object') {
      Object.entries(vehicles as VehicleCounts).forEach(([type, count]) => {
        laneData[type] = count;
      });
    }
    
    return laneData;
  });

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
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="car" fill="#4F46E5" name="Carros" />
          <Bar dataKey="bus" fill="#16A34A" name="Buses" />
          <Bar dataKey="truck" fill="#DC2626" name="Camiones" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}