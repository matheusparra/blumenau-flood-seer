
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Droplets, 
  AlertTriangle, 
  MapPin, 
  TrendingUp,
  Activity,
  Waves,
  ThermometerSun
} from 'lucide-react';
import WeatherData from '@/components/WeatherData';
import FloodPrediction from '@/components/FloodPrediction';
import BlumenauMap from '@/components/BlumenauMap';
import AlertSystem from '@/components/AlertSystem';
import MLModel from '@/components/MLModel';
import { useFloodData } from '@/hooks/useFloodData';

const Index = () => {
  const { latestData, data, loading, error, calculateAlertLevel } = useFloodData();
  const [currentAlert, setCurrentAlert] = useState('baixo');

  // Atualizar alert baseado nos dados reais
  useEffect(() => {
    if (latestData) {
      const alertLevel = calculateAlertLevel(latestData);
      setCurrentAlert(alertLevel);
    }
  }, [latestData]);

  // Converter dados do Supabase para o formato esperado pelos componentes
  const weatherData = latestData ? {
    precipitation: latestData.chuva_1h,
    riverLevel: latestData.nivel_rio,
    temperature: 20 + Math.random() * 10, // Simular temperatura (não temos no BD)
    humidity: latestData.umidade
  } : {
    precipitation: 0,
    riverLevel: 2.1,
    temperature: 24,
    humidity: 68
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critico': return 'bg-red-500';
      case 'alto': return 'bg-orange-500';
      case 'medio': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getAlertText = (level: string) => {
    switch (level) {
      case 'critico': return 'CRÍTICO';
      case 'alto': return 'ALTO';
      case 'medio': return 'MÉDIO';
      default: return 'BAIXO';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Waves className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Carregando dados meteorológicos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Waves className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema de Predição de Enchentes</h1>
                <p className="text-gray-600">Blumenau - Santa Catarina</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Última atualização: {latestData ? new Date(latestData.created_at).toLocaleTimeString() : 'Carregando...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Alert Banner */}
        <AlertSystem currentAlert={currentAlert} onAlertChange={setCurrentAlert} />

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="prediction" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Predições ML
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Meteorologia
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Mapa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Precipitação 1h</p>
                      <p className="text-2xl font-bold">{weatherData.precipitation.toFixed(1)}mm</p>
                    </div>
                    <Droplets className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Nível do Rio</p>
                      <p className="text-2xl font-bold">{weatherData.riverLevel.toFixed(2)}m</p>
                    </div>
                    <Waves className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Umidade</p>
                      <p className="text-2xl font-bold">{weatherData.humidity.toFixed(1)}%</p>
                    </div>
                    <Cloud className="h-8 w-8 text-gray-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Risco Atual</p>
                      <Badge className={`${getAlertColor(currentAlert)} text-white`}>
                        {getAlertText(currentAlert)}
                      </Badge>
                    </div>
                    <AlertTriangle className={`h-8 w-8 ${currentAlert === 'baixo' ? 'text-green-500' : 'text-orange-500'}`} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherData data={weatherData} historicalData={data} />
              <FloodPrediction alert={currentAlert} />
            </div>
          </TabsContent>

          <TabsContent value="prediction">
            <MLModel weatherData={weatherData} onPredictionChange={setCurrentAlert} />
          </TabsContent>

          <TabsContent value="weather">
            <WeatherData data={weatherData} historicalData={data} detailed={true} />
          </TabsContent>

          <TabsContent value="map">
            <BlumenauMap alert={currentAlert} riverLevel={weatherData.riverLevel} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
