
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cloud, Droplets, Waves, ThermometerSun } from 'lucide-react';

interface WeatherDataProps {
  data: {
    precipitation: number;
    riverLevel: number;
    temperature: number;
    humidity: number;
  };
  detailed?: boolean;
}

const WeatherData: React.FC<WeatherDataProps> = ({ data, detailed = false }) => {
  // Gerar dados históricos simulados para os gráficos
  const generateHistoricalData = () => {
    const hours = [];
    for (let i = 23; i >= 0; i--) {
      hours.push({
        hour: `${String(24 - i).padStart(2, '0')}:00`,
        precipitation: Math.random() * 15,
        riverLevel: 1.5 + Math.random() * 2,
        temperature: 18 + Math.random() * 12,
        humidity: 40 + Math.random() * 40
      });
    }
    return hours;
  };

  const historicalData = generateHistoricalData();

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
                Precipitação 24h
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}mm`, 'Precipitação']} />
                  <Area type="monotone" dataKey="precipitation" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5 text-blue-600" />
                Nível do Rio 24h
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}m`, 'Nível do Rio']} />
                  <Line type="monotone" dataKey="riverLevel" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Dados Meteorológicos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
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
      </CardContent>
    </Card>
  );
};

export default WeatherData;
