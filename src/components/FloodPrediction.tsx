
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface FloodPredictionProps {
  alert: string;
}

const FloodPrediction: React.FC<FloodPredictionProps> = ({ alert }) => {
  const getPredictionData = () => {
    switch (alert) {
      case 'critico':
        return {
          probability: 85,
          timeToFlood: '2-4 horas',
          affectedAreas: ['Centro', 'Vila Nova', 'Ponta Aguda'],
          recommendations: ['Evacuação imediata', 'Evitar áreas baixas', 'Seguir rotas de emergência']
        };
      case 'alto':
        return {
          probability: 65,
          timeToFlood: '6-8 horas',
          affectedAreas: ['Centro', 'Vila Nova'],
          recommendations: ['Preparar evacuação', 'Mover veículos', 'Estocar suprimentos']
        };
      case 'medio':
        return {
          probability: 35,
          timeToFlood: '12-24 horas',
          affectedAreas: ['Áreas ribeirinhas'],
          recommendations: ['Monitorar situação', 'Preparar kit emergência']
        };
      default:
        return {
          probability: 10,
          timeToFlood: '> 48 horas',
          affectedAreas: [],
          recommendations: ['Situação normal', 'Monitoramento contínuo']
        };
    }
  };

  const prediction = getPredictionData();

  const getColorByAlert = (alert: string) => {
    switch (alert) {
      case 'critico': return 'text-red-600';
      case 'alto': return 'text-orange-600';
      case 'medio': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getIconByAlert = (alert: string) => {
    switch (alert) {
      case 'critico': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'alto': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medio': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Predição de Enchentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Probabilidade */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Probabilidade de Enchente</span>
            <span className={`text-sm font-bold ${getColorByAlert(alert)}`}>
              {prediction.probability}%
            </span>
          </div>
          <Progress value={prediction.probability} className="h-2" />
        </div>

        {/* Tempo estimado */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Tempo Estimado:</span>
          <span className="text-sm font-bold">{prediction.timeToFlood}</span>
        </div>

        {/* Áreas afetadas */}
        <div>
          <h4 className="text-sm font-medium mb-2">Áreas de Risco:</h4>
          <div className="flex flex-wrap gap-2">
            {prediction.affectedAreas.length > 0 ? (
              prediction.affectedAreas.map((area, index) => (
                <Badge key={index} variant="destructive">
                  {area}
                </Badge>
              ))
            ) : (
              <Badge variant="outline" className="text-green-600">
                Nenhuma área em risco
              </Badge>
            )}
          </div>
        </div>

        {/* Recomendações */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            {getIconByAlert(alert)}
            Recomendações:
          </h4>
          <ul className="space-y-1">
            {prediction.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Alert específico */}
        {alert !== 'baixo' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {alert === 'critico' && 'ALERTA CRÍTICO: Risco iminente de enchente. Siga as orientações de evacuação.'}
              {alert === 'alto' && 'ALERTA ALTO: Condições favoráveis para enchentes. Prepare-se.'}
              {alert === 'medio' && 'ALERTA MÉDIO: Monitore a situação e mantenha-se preparado.'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FloodPrediction;
