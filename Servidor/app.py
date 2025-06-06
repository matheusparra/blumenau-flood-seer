from flask import Flask, request, jsonify
import joblib
import pandas as pd
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

app = Flask(__name__)

# --- Configuração do Supabase ---
# As credenciais estão no seu arquivo 'src/integrations/supabase/client.ts'.
# Use variáveis de ambiente para segurança!
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") # Use a SERVICE KEY para operações de escrita

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERRO: Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_KEY não definidas.")
    exit()

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
print("Cliente Supabase inicializado com sucesso.")

# --- Carregamento do Modelo de ML ---
try:
    model = joblib.load('modelo_random_forest.joblib')
    print("Modelo de ML 'modelo_random_forest.joblib' carregado.")
except FileNotFoundError:
    print("AVISO: Modelo 'modelo_random_forest.joblib' não encontrado. As predições não funcionarão.")
    model = None

@app.route('/add-reading', methods=['POST'])
def add_sensor_reading():
    """
    Endpoint para receber dados do ESP32, fazer predição e salvar no Supabase.
    """
    # 1. Obter dados JSON da requisição
    sensor_data = request.get_json()
    if not sensor_data:
        return jsonify({'error': 'Nenhum dado JSON enviado'}), 400
    
    print(f"Dados recebidos do ESP32: {sensor_data}")

    # 2. Executar o Modelo de Machine Learning (se disponível)
    risco_predito = 0 # Valor padrão
    if model:
        try:
            # Garanta que todas as features necessárias estão presentes
            features = ['nivel_rio', 'chuva_1h', 'chuva_6h', 'chuva_24h', 'umidade', 'vento', 'tendencia_rio']
            # Cria um DataFrame com os dados do sensor, preenchendo o que faltar com 0
            input_df = pd.DataFrame([sensor_data], columns=features).fillna(0)
            
            prediction = model.predict(input_df[features])
            risco_predito = int(prediction[0])
            print(f"Predição do modelo: Risco Nível {risco_predito}")
        except Exception as e:
            print(f"Erro ao executar o modelo: {e}")
            return jsonify({'error': f'Erro na predição: {e}'}), 500
            
    # 3. Preparar o registro para inserir no Supabase
    # O schema da sua tabela é: ['chuva_1h', 'chuva_6h', 'chuva_24h', 'nivel_rio', 'tendencia_rio', 'umidade', 'vento', 'risco_enchente']
    data_to_insert = {
        'chuva_1h': sensor_data.get('chuva_1h', 0),
        'chuva_6h': sensor_data.get('chuva_6h', 0),
        'chuva_24h': sensor_data.get('chuva_24h', 0),
        'nivel_rio': sensor_data.get('nivel_rio', 0),
        'tendencia_rio': sensor_data.get('tendencia_rio', 0), # Ex: 1 para subindo, -1 para descendo, 0 estável
        'umidade': sensor_data.get('umidade', 0),
        'vento': sensor_data.get('vento', 0),
        'risco_enchente': risco_predito # Usamos o resultado do nosso modelo!
    }

    # 4. Inserir os dados no Supabase
    try:
        response = supabase.table('flood_data').insert(data_to_insert).execute()
        
        # Checar se a inserção foi bem sucedida
        if len(response.data) > 0:
            print(f"Dados inseridos no Supabase com sucesso: {response.data[0]}")
            return jsonify({
                'message': 'Dados recebidos e armazenados com sucesso!',
                'data_inserted': response.data[0]
            }), 201
        else:
            # A API do Supabase pode retornar sucesso com 'data' vazio se houver algum problema sutil.
            # Verifique a resposta completa para depuração.
            print(f"Erro na resposta do Supabase: {response}")
            return jsonify({'error': 'Falha ao inserir dados no Supabase', 'details': str(response.error)}), 500

    except Exception as e:
        print(f"Exceção ao comunicar com Supabase: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)