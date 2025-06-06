
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cloud, Droplets, Waves, ThermometerSun } from 'lucide-react';
import { FloodDataPoint } from '@/hooks/useFloodData';

interface WeatherDataProps {
  data: {
    precipitation: number;
    riverLevel: number;
    temperature: number;
    humidity: number;
  };
  historicalData?: FloodDataPoint[];
  detailed?: boolean;
}

const WeatherData: React.FC<WeatherDataProps> = ({ data, historicalData = [], detailed = false }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  // Atualizar dados do gráfico quando historicalData mudar (tempo real)
  useEffect(() => {
    console.log('WeatherData: Atualizando dados históricos', historicalData.length, 'registros');
    
    const newChartData = historicalData.map(point => ({
      hour: new Date(point.created_at).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      precipitation: Number(point.chuva_1h) || 0,
      riverLevel: Number(point.nivel_rio) || 0,
      temperature: 20 + Math.random() * 10, // Simular temperatura
      humidity: Number(point.umidade) || 0,
      fullDate: point.created_at
    }));

    setChartData(newChartData);
  }, [historicalData]);

  // Log dos dados atuais para debug
  useEffect(() => {
    console.log('WeatherData: Dados atuais recebidos', data);
  }, [data]);

  if (detailed) {
    return (
      <div className="space-y-6">
        {/* Dados atuais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Chuva Atual</span>
              </div>
              <p className="text-2xl font-bold">{data.precipitation.toFixed(1)}mm</p>
              <p className="text-xs text-gray-500">Última hora</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Waves className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Nível Rio</span>
              </div>
              <p className="text-2xl font-bold">{data.riverLevel.toFixed(2)}m</p>
              <p className="text-xs text-gray-500">Rio Itajaí-Açu</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ThermometerSun className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Temperatura</span>
              </div>
              <p className="text-2xl font-bold">{data.temperature.toFixed(1)}°C</p>
              <p className="text-xs text-gray-500">Sensação térmica</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium">Umidade</span>
              </div>
              <p className="text-2xl font-bold">{data.humidity.toFixed(0)}%</p>
              <p className="text-xs text-gray-500">Umidade relativa</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos detalhados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                Precipitação - Dados Reais
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value}mm`, 'Precipitação']}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          return new Date(payload[0].payload.fullDate).toLocaleString('pt-BR');
                        }
                        return label;
                      }}
                    />
                    <Area type="monotone" dataKey="precipitation" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500">
                  <p>Aguardando dados...</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5 text-blue-600" />
                Nível do Rio - Dados Reais
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value}m`, 'Nível do Rio']}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          return new Date(payload[0].payload.fullDate).toLocaleString('pt-BR');
                        }
                        return label;
                      }}
                    />
                    <Line type="monotone" dataKey="riverLevel" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-500">
                  <p>Aguardando dados...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas dos dados reais */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas dos Dados Reais (Tempo Real)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total de registros:</p>
                  <p className="font-bold">{chartData.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Precipitação máxima:</p>
                  <p className="font-bold">{Math.max(...chartData.map(d => d.precipitation)).toFixed(1)}mm</p>
                </div>
                <div>
                  <p className="text-gray-600">Nível máximo do rio:</p>
                  <p className="font-bold">{Math.max(...chartData.map(d => d.riverLevel)).toFixed(2)}m</p>
                </div>
                <div>
                  <p className="text-gray-600">Umidade média:</p>
                  <p className="font-bold">{(chartData.reduce((acc, d) => acc + d.humidity, 0) / chartData.length).toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Dados Meteorológicos - Tempo Real
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip 
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return new Date(payload[0].payload.fullDate).toLocaleString('pt-BR');
                  }
                  return label;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="precipitation" 
                stroke="#3b82f6" 
                name="Precipitação (mm)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="riverLevel" 
                stroke="#059669" 
                name="Nível do Rio (m)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Waves className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-2" />
              <p>Carregando dados em tempo real...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherData;
