
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FloodDataPoint {
  id: string;
  chuva_1h: number;
  chuva_6h: number;
  chuva_24h: number;
  nivel_rio: number;
  tendencia_rio: number;
  umidade: number;
  vento: number;
  risco_enchente: number;
  created_at: string;
  updated_at: string;
}

export const useFloodData = () => {
  const [data, setData] = useState<FloodDataPoint[]>([]);
  const [latestData, setLatestData] = useState<FloodDataPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados mais recentes
  const fetchLatestData = async () => {
    try {
      const { data: floodData, error } = await supabase
        .from('flood_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      
      setLatestData(floodData);
      console.log('Dados mais recentes carregados:', floodData);
    } catch (err) {
      console.error('Erro ao carregar dados mais recentes:', err);
      setError('Erro ao carregar dados mais recentes');
    }
  };

  // Buscar dados históricos das últimas 24 horas
  const fetchHistoricalData = async () => {
    try {
      const { data: floodData, error } = await supabase
        .from('flood_data')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setData(floodData || []);
      console.log('Dados históricos carregados:', floodData?.length, 'registros');
    } catch (err) {
      console.error('Erro ao carregar dados históricos:', err);
      setError('Erro ao carregar dados históricos');
    } finally {
      setLoading(false);
    }
  };

  // Calcular nível de alerta baseado nos dados reais
  const calculateAlertLevel = (dataPoint: FloodDataPoint): string => {
    const risco = dataPoint.risco_enchente;
    switch (risco) {
      case 3: return 'critico';
      case 2: return 'alto';
      case 1: return 'medio';
      default: return 'baixo';
    }
  };

  useEffect(() => {
    fetchLatestData();
    fetchHistoricalData();

    // Configurar realtime para atualizações em tempo real
    const channel = supabase
      .channel('flood-data-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'flood_data'
        },
        (payload) => {
          console.log('Novos dados recebidos:', payload.new);
          const newData = payload.new as FloodDataPoint;
          setLatestData(newData);
          setData(prev => [...prev, newData].slice(-24)); // Manter apenas últimas 24 horas
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    data,
    latestData,
    loading,
    error,
    fetchLatestData,
    fetchHistoricalData,
    calculateAlertLevel
  };
};
