
# 🌊 Blumenau Flood Seer

**Status:** `Prova de Conceito (POC) Funcional`

Um projeto desenvolvido para a **Global Solution 2025.1 da FIAP**, focado na previsão, monitoramento e mitigação dos impactos de enchentes em Blumenau/SC, utilizando Inteligência Artificial e simulação de hardware IoT.

-----

### Tabela de Conteúdos

1.  [Sobre o Projeto](https://www.google.com/search?q=%231-sobre-o-projeto-)
2.  [Arquitetura da Solução](https://www.google.com/search?q=%232-arquitetura-da-solu%C3%A7%C3%A3o-)
3.  [Fonte de Dados: AlertaBlu](https://www.google.com/search?q=%233-fonte-de-dados-alertablu-)
4.  [Hardware e Simulação com Wokwi](https://www.google.com/search?q=%234-hardware-e-simula%C3%A7%C3%A3o-com-wokwi-%EF%B8%8F)
5.  [Tecnologias Utilizadas](https://www.google.com/search?q=%235-tecnologias-utilizadas-)
6.  [Como Executar o Projeto](https://www.google.com/search?q=%236-como-executar-o-projeto-)
7.  [Estrutura do Repositório](https://www.google.com/search?q=%237-estrutura-do-reposit%C3%B3rio-)
8.  [Integrantes](https://www.google.com/search?q=%238-integrantes-)

-----

## 1\. Sobre o Projeto 🎯

O **Blumenau Flood Seer** é uma plataforma digital completa que visa combater os desafios impostos pelas cheias recorrentes em Blumenau. A solução integra dados históricos e em tempo real para alimentar um modelo de Machine Learning capaz de prever o nível do rio, gerando alertas e fornecendo visualizações claras para auxiliar na tomada de decisão de autoridades e cidadãos.

O sistema é composto por:

  * Uma **interface web interativa** para visualização de dados e alertas.
  * Uma **API backend** que centraliza a lógica de negócio e as predições.
  * Um **modelo de IA** treinado para prever o nível do rio com base em dados de chuva e medições anteriores.
  * Uma **simulação de sensor IoT (ESP32)** que envia dados de medição para a plataforma.

## 2\. Arquitetura da Solução 🏗️

A solução é modular e foi desenhada para ser escalável, dividindo-se nos seguintes componentes:

  * **Frontend (Cliente Web):** Desenvolvido em **React com TypeScript**, oferece uma experiência de usuário rica e reativa. Renderiza mapas, gráficos e os alertas gerados pelo backend.
  * **Backend (Servidor API):** Construído com **Flask (Python)**, serve como o cérebro da operação. Ele expõe endpoints para o frontend, processa os dados recebidos dos sensores e executa o modelo de IA para gerar previsões.
  * **Inteligência Artificial (ML):** Utilizando **Scikit-learn**, um modelo de regressão linear foi treinado para prever o nível do rio (`river_level_m`). O script `treino_modelo.py` pode ser usado para retreinar e atualizar o modelo.
  * **Microcontrolador (Simulação IoT):** Para simular a coleta de dados em campo, utilizamos o **Wokwi**, uma plataforma online de simulação de circuitos. Um ESP32 simulado com um sensor de nível de água envia dados para um script Python (`simulator.py`) que, por sua vez, os repassa para a API do backend, imitando um dispositivo real em operação.

## 3\. Fonte de Dados: AlertaBlu 📊

Para garantir a máxima relevância e precisão para o problema específico de Blumenau, optamos por utilizar a base de dados fornecida pelo **AlertaBlu**, o Sistema de Monitoramento e Alerta de Eventos Extremos de Blumenau.

Os dados, contidos no arquivo `Data/dados_enchentes.csv`, incluem registros históricos cruciais como:

  * `data_hora`: Timestamp da medição.
  * `rain_mm`: Precipitação em milímetros.
  * `river_level_m`: Nível do rio em metros.

Essa escolha garante que nosso modelo seja treinado com informações que refletem a realidade hidrológica da região, aumentando a acurácia e a utilidade das previsões.

## 4\. Hardware e Simulação com Wokwi ⚙️

Um dos requisitos da Global Solution é a integração com um microcontrolador **ESP32** e sensores. Para esta prova de conceito, realizamos uma simulação completa e funcional utilizando a plataforma **Wokwi**.

  * **Circuito Simulado:** O arquivo `microcontrolador/diagram.json` contém a definição do nosso circuito no Wokwi, que consiste em um **ESP32** conectado a um sensor ultrassônico para medir a distância até a superfície da água (simulando o nível do rio).
  * **Integração com Python:** O Wokwi permite que o código do ESP32 (em MicroPython ou C++) se comunique com o ambiente externo. O script `microcontrolador/simulator.py` atua como uma "ponte": ele recebe os dados gerados pelo ESP32 simulado e os envia via requisições HTTP para a nossa API Flask, exatamente como um dispositivo físico faria.

Essa abordagem nos permite validar toda a arquitetura de software e o fluxo de dados (Sensor -\> API -\> Frontend) de forma robusta, antes da implementação em hardware físico.

## 5\. Tecnologias Utilizadas 💻

| Componente | Tecnologia/Framework |
| :--- | :--- |
| **Backend** | `Python`, `Flask`, `Pandas`, `Waitress` |
| **Inteligência Artificial**| `Scikit-learn` |
| **Frontend** | `React`, `TypeScript`, `Vite`, `TailwindCSS`, `Shadcn/ui` |
| **Hardware (Simulação)**| `Wokwi`, `ESP32` |
| **Banco de Dados** | `Supabase` (para dados em tempo real no frontend) |

## 6\. Como Executar o Projeto 🚀

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente local.

#### **Pré-requisitos**

  * **Python** (versão 3.9 ou superior)
  * **Node.js** e **npm** (ou Yarn)
  * Acesso a um terminal ou linha de comando

-----

#### **1. Backend & IA**

Do diretório raiz do projeto:

```bash
# 1. Crie e ative um ambiente virtual (recomendado)
python -m venv venv
# No Windows:
.\venv\Scripts\activate
# No macOS/Linux:
source venv/bin/activate

# 2. Instale as dependências do Python
pip install -r requirements.txt

# 3. (Opcional) Treine o modelo de IA. Um modelo pré-treinado já está incluso.
python src/treino_modelo.py

# 4. Inicie o servidor Flask
# O servidor rodará em http://127.0.0.1:5000
python Servidor/app.py
```

-----

#### **2. Frontend**

Em um **novo terminal**, na raiz do projeto:

```bash
# 1. Instale as dependências do Node.js
npm install

# 2. Inicie o servidor de desenvolvimento do Vite
# A interface estará acessível em http://localhost:5173
npm run dev
```

-----

#### **3. Simulação do Sensor ESP32**

Para completar o fluxo, inicie o simulador que envia dados para o backend. Em um **terceiro terminal**:

```bash
# 1. Certifique-se de que seu ambiente virtual Python está ativado

# 2. Execute o script do simulador
python microcontrolador/simulator.py
```

Agora, com os três componentes rodando, acesse **`http://localhost:5173`** em seu navegador para ver a aplicação completa em funcionamento\!

## 7\. Estrutura do Repositório 📁

```
.
├── Data/
│   └── dados_enchentes.csv    # Base de dados do AlertaBlu
├── Lib/                       # Dependências do ambiente virtual
├── microcontrolador/
│   ├── diagram.json           # Diagrama do circuito no Wokwi
│   └── simulator.py           # Script que simula o envio de dados do sensor
├── Servidor/
│   └── app.py                 # Servidor API em Flask
├── src/
│   ├── components/            # Componentes React
│   ├── hooks/                 # Hooks React
│   ├── pages/                 # Páginas da aplicação
│   ├── App.tsx                # Componente principal React
│   ├── main.tsx               # Ponto de entrada do Frontend
│   ├── predicao.py            # Script para fazer predições
│   └── treino_modelo.py       # Script para treinar o modelo de IA
├── modelo_enchente.joblib     # Modelo de IA pré-treinado
├── requirements.txt           # Dependências do Python
├── package.json               # Dependências do Node.js
└── README.md                  # Este arquivo
```

## 8\. Integrantes 🧑‍💻

  * **Matheus Parra** - RM561907
  * **Otavio Custodio de Oliveira** - RM565606
  * **Tiago Alves Cordeiro** - RM561791 
  * **Thiago Henrique Pereira de Almeida Santos** - RM563327
  * **Leandro Arthur Marinho Ferreira** - RM565240
