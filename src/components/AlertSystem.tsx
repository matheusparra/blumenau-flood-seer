import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Bell, Volume2 } from 'lucide-react';

// 1. A interface de propriedades foi simplificada.
// A função 'onAlertChange' não é mais necessária, pois o alerta é controlado pelo componente pai.
interface AlertSystemProps {
  currentAlert: string;
}

const AlertSystem: React.FC<AlertSystemProps> = ({ currentAlert }) => {
  const getAlertConfig = () => {
    switch (currentAlert) {
      case 'critico':
        return {
          icon: <XCircle className="h-5 w-5" />,
          title: 'ALERTA CRÍTICO DE ENCHENTE',
          message: 'Risco iminente de enchente em Blumenau. Evacuação imediata recomendada para áreas de risco.',
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          badgeColor: 'bg-red-500',
          action: 'Evacuação Imediata'
        };
      case 'alto':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          title: 'ALERTA ALTO DE ENCHENTE',
          message: 'Condições meteorológicas indicam alto risco de enchente nas próximas 6-8 horas.',
          bgColor: 'bg-orange-50 border-orange-200',
          textColor: 'text-orange-800',
          badgeColor: 'bg-orange-500',
          action: 'Preparar Evacuação'
        };
      case 'medio':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          title: 'ALERTA MÉDIO DE ENCHENTE',
          message: 'Monitoramento intensificado. Possibilidade de enchente nas próximas 12-24 horas.',
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          badgeColor: 'bg-yellow-500',
          action: 'Monitorar Situação'
        };
      default:
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          title: 'SITUAÇÃO NORMAL',
          message: 'Condições meteorológicas normais. Monitoramento contínuo ativo.',
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          badgeColor: 'bg-green-500',
          action: 'Situação Controlada'
        };
    }
  };

  const config = getAlertConfig();

  return (
    <div className="space-y-4 mb-6">
      {/* Alert Principal */}
      <Alert className={`${config.bgColor} ${config.textColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config.icon}
            <div>
              <h3 className="font-bold text-lg">{config.title}</h3>
              <AlertDescription className="mt-1">
                {config.message}
              </AlertDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${config.badgeColor} text-white`}>
              {config.action}
            </Badge>
            {currentAlert !== 'baixo' && (
              <Button size="sm" variant="outline" className="gap-2">
                <Bell className="h-4 w-4" />
                Notificar
              </Button>
            )}
          </div>
        </div>
      </Alert>
      
      {/* 2. O bloco de simulação de alertas foi removido. */}

      {/* Instruções específicas por nível */}
      {currentAlert !== 'baixo' && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Instruções de Emergência:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {currentAlert === 'critico' && (
              <>
                <li>• Evacuação IMEDIATA das áreas de risco</li>
                <li>• Siga as rotas de evacuação estabelecidas</li>
                <li>• Dirija-se aos pontos de abrigo mais próximos</li>
                <li>• Mantenha contato com autoridades locais</li>
              </>
            )}
            {currentAlert === 'alto' && (
              <>
                <li>• Prepare-se para possível evacuação</li>
                <li>• Mova veículos para locais seguros</li>
                <li>• Estocar água e alimentos não perecíveis</li>
                <li>• Mantenha documentos importantes seguros</li>
              </>
            )}
            {currentAlert === 'medio' && (
              <>
                <li>• Monitore constantemente os alertas</li>
                <li>• Prepare kit de emergência</li>
                <li>• Evite áreas próximas ao rio</li>
                <li>• Mantenha telefone carregado</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AlertSystem;