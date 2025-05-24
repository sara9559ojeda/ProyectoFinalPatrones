
interface Bottleneck {
  lane: string;
  avgSpeed: number;
  totalVehicles: number;
  heavyVehicles: number;
}

export default function BottleneckChart({ data }: { data: Bottleneck[] }) {
  if (!data || data.length === 0) return <div>No se identificaron cuellos de botella</div>;
  
  return (
    <div className="space-y-4">
      {data.map((bottleneck, index) => (
        <div key={index} className="bg-red-50 p-4 border border-red-200 rounded-lg">
          <h3 className="font-bold text-red-700">{bottleneck.lane.replace('lane_', 'Carril ')}</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-white p-2 rounded">
              <p className="text-sm text-gray-500">Velocidad Promedio</p>
              <p className="font-bold">{Math.round(bottleneck.avgSpeed * 100) / 100} km/h</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="text-sm text-gray-500">Total Vehículos</p>
              <p className="font-bold">{bottleneck.totalVehicles}</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="text-sm text-gray-500">Vehículos Pesados</p>
              <p className="font-bold">{bottleneck.heavyVehicles}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}