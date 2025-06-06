
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
      console.log('Buscando dados mais recentes...');
      const { data: floodData, error } = await supabase
        .from('flood_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar dados mais recentes:', error);
        throw error;
      }
      
      if (floodData) {
        setLatestData(floodData);
        console.log('Dados mais recentes carregados:', floodData);
      } else {
        console.log('Nenhum dado encontrado');
      }
    } catch (err) {
      console.error('Erro ao carregar dados mais recentes:', err);
      setError('Erro ao carregar dados mais recentes');
    }
  };

  // Buscar dados históricos das últimas 24 horas
  const fetchHistoricalData = async () => {
    try {
      console.log('Buscando dados históricos...');
      const { data: floodData, error } = await supabase
        .from('flood_data')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar dados históricos:', error);
        throw error;
      }
      
      setData(floodData || []);
      console.log('Dados históricos carregados:', floodData?.length || 0, 'registros');
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
    console.log('Inicializando useFloodData...');
    
    // Carregar dados iniciais
    const loadInitialData = async () => {
      await Promise.all([
        fetchLatestData(),
        fetchHistoricalData()
      ]);
    };

    loadInitialData();

    // Configurar realtime para atualizações em tempo real
    console.log('Configurando realtime subscription...');
    const channel = supabase
      .channel('flood-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escutar todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'flood_data'
        },
        (payload) => {
          console.log('Evento realtime recebido:', payload.eventType, payload.new);
          
          if (payload.eventType === 'INSERT' && payload.new) {
            const newData = payload.new as FloodDataPoint;
            
            // Atualizar dados mais recentes
            setLatestData(newData);
            
            // Adicionar aos dados históricos e manter apenas últimas 24h
            setData(prev => {
              const updated = [...prev, newData];
              const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
              return updated.filter(item => new Date(item.created_at) > oneDayAgo);
            });
            
            console.log('Dados atualizados em tempo real');
          }
        }
      )
      .subscribe((status) => {
        console.log('Status da subscription realtime:', status);
      });

    return () => {
      console.log('Removendo subscription realtime...');
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
