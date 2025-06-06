
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Waves, AlertTriangle } from 'lucide-react';

interface BlumenauMapProps {
  alert: string;
  riverLevel: number;
}

const BlumenauMap: React.FC<BlumenauMapProps> = ({ alert, riverLevel }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: 'AIzaSyB-_o4cC6Pz0JOTSgkzusiCbR8Qw8r75hc',
          version: 'weekly',
          libraries: ['places']
        });

        const { Map } = await loader.importLibrary('maps');
        const { AdvancedMarkerElement } = await loader.importLibrary('marker');

        if (!mapRef.current) return;

        // Coordenadas de Blumenau, SC
        const blumenauCenter = { lat: -26.9194, lng: -49.0661 };

        const map = new Map(mapRef.current, {
          zoom: 13,
          center: blumenauCenter,
          mapId: 'blumenau-flood-map',
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#3b82f6' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f1f5f9' }]
            }
          ]
        });

        // Pontos de monitoramento em Blumenau
        const monitoringPoints = [
          {
            position: { lat: -26.9194, lng: -49.0661 },
            title: 'Centro - Rio Itajaí-Açu',
            level: riverLevel,
            status: alert
          },
          {
            position: { lat: -26.9034, lng: -49.0789 },
            title: 'Ponta Aguda - Sensor Principal',
            level: riverLevel + 0.3,
            status: alert
          },
          {
            position: { lat: -26.9324, lng: -49.0445 },
            title: 'Garcia - Monitoramento',
            level: riverLevel - 0.2,
            status: alert === 'critico' ? 'alto' : alert
          },
          {
            position: { lat: -26.8967, lng: -49.0923 },
            title: 'Velha - Rio Itajaí-Açu',
            level: riverLevel + 0.1,
            status: alert
          }
        ];

        // Adicionar marcadores para cada ponto de monitoramento
        monitoringPoints.forEach((point) => {
          const markerElement = document.createElement('div');
          markerElement.className = 'relative';
          markerElement.innerHTML = `
            <div class="flex flex-col items-center">
              <div class="p-2 rounded-full shadow-lg ${getMarkerColor(point.status)} text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div class="mt-1 px-2 py-1 bg-white rounded shadow text-xs font-semibold text-gray-800">
                ${point.level.toFixed(2)}m
              </div>
            </div>
          `;

          const marker = new AdvancedMarkerElement({
            map,
            position: point.position,
            content: markerElement,
            title: point.title
          });

          // InfoWindow para mostrar detalhes
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold text-sm">${point.title}</h3>
                <p class="text-xs text-gray-600">Nível: ${point.level.toFixed(2)}m</p>
                <p class="text-xs">Status: <span class="${getStatusTextColor(point.status)}">${getStatusText(point.status)}</span></p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar Google Maps:', error);
        setMapError('Erro ao carregar o mapa');
        setIsLoading(false);
      }
    };

    initMap();
  }, [alert, riverLevel]);

  const getMarkerColor = (status: string) => {
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

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'critico': return 'text-red-600 font-bold';
      case 'alto': return 'text-orange-600 font-bold';
      case 'medio': return 'text-yellow-600 font-bold';
      default: return 'text-green-600 font-bold';
    }
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

  if (mapError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Blumenau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <p className="text-gray-600">{mapError}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Mapa de Monitoramento - Blumenau/SC
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge className={`${getAlertColor(alert)} text-white`}>
            Risco: {getAlertText(alert)}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Waves className="h-4 w-4" />
            Nível atual: {riverLevel.toFixed(2)}m
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600">Carregando mapa...</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="h-96 w-full rounded-lg" />
        </div>

        {/* Legenda */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Legenda dos Sensores:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Baixo Risco</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Médio Risco</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Alto Risco</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Crítico</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlumenauMap;
