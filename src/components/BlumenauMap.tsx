
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Waves, AlertTriangle } from 'lucide-react';

interface BlumenauMapProps {
  alert: string;
  riverLevel: number;
}

const BlumenauMap: React.FC<BlumenauMapProps> = ({ alert, riverLevel }) => {
  const monitoringPoints = [
    { id: 1, name: 'Centro', lat: -26.9194, lng: -49.0661, status: alert, level: riverLevel },
    { id: 2, name: 'Vila Nova', lat: -26.9150, lng: -49.0500, status: alert === 'critico' ? 'alto' : alert, level: riverLevel - 0.2 },
    { id: 3, name: 'Ponta Aguda', lat: -26.9300, lng: -49.0800, status: alert === 'critico' ? 'critico' : 'medio', level: riverLevel + 0.1 },
    { id: 4, name: 'Velha', lat: -26.9000, lng: -49.0400, status: 'baixo', level: riverLevel - 0.3 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critico': return 'bg-red-500';
      case 'alto': return 'bg-orange-500';
      case 'medio': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critico': return 'CRÍTICO';
      case 'alto': return 'ALTO';
      case 'medio': return 'MÉDIO';
      default: return 'BAIXO';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Monitoramento - Blumenau
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mapa simulado */}
          <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-lg h-96 overflow-hidden">
            {/* Rio Itajaí-Açu */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                {/* Rio principal */}
                <path
                  d="M 50 150 Q 150 120 200 150 T 350 140"
                  stroke="#2563eb"
                  strokeWidth="8"
                  fill="none"
                  className="opacity-70"
                />
                <path
                  d="M 50 150 Q 150 120 200 150 T 350 140"
                  stroke="#60a5fa"
                  strokeWidth="4"
                  fill="none"
                />
                
                {/* Tributários */}
                <path d="M 100 100 L 150 130" stroke="#3b82f6" strokeWidth="3" fill="none" />
                <path d="M 250 120 L 200 145" stroke="#3b82f6" strokeWidth="3" fill="none" />
                <path d="M 300 180 L 280 155" stroke="#3b82f6" strokeWidth="3" fill="none" />
              </svg>
            </div>

            {/* Pontos de monitoramento */}
            {monitoringPoints.map((point, index) => (
              <div
                key={point.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${20 + index * 20}%`,
                  top: `${40 + (index % 2) * 20}%`
                }}
              >
                <div className="relative group">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(point.status)} animate-pulse`}></div>
                  <div className={`absolute inset-0 w-4 h-4 rounded-full ${getStatusColor(point.status)} animate-ping opacity-30`}></div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    <p className="font-semibold text-sm">{point.name}</p>
                    <p className="text-xs text-gray-600">Nível: {point.level.toFixed(2)}m</p>
                    <Badge className={`${getStatusColor(point.status)} text-white text-xs`}>
                      {getStatusText(point.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {/* Legenda */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
              <h4 className="text-sm font-semibold mb-2">Níveis de Alerta</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Baixo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs">Médio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-xs">Alto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">Crítico</span>
                </div>
              </div>
            </div>

            {/* Escala */}
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg border">
              <div className="text-xs text-gray-600">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-4 h-0.5 bg-gray-400"></div>
                  <span>1 km</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estações de Monitoramento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5" />
            Estações de Monitoramento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monitoringPoints.map((point) => (
              <div key={point.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(point.status)}`}></div>
                  <div>
                    <p className="font-medium">{point.name}</p>
                    <p className="text-sm text-gray-600">Nível: {point.level.toFixed(2)}m</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(point.status)} text-white`}>
                  {getStatusText(point.status)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlumenauMap;
