
#!/bin/bash

# Script de deploy para VPS
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="blumenau-flood-seer"

echo "🚀 Iniciando deploy do $PROJECT_NAME em ambiente $ENVIRONMENT..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instalando..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker instalado. Faça logout e login novamente."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Instalando..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose instalado."
fi

# Verificar se arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado. Criando a partir do .env.example..."
    cp .env.example .env
    echo "📝 Por favor, edite o arquivo .env com suas configurações antes de continuar."
    echo "Principalmente: SUPABASE_URL e SUPABASE_SERVICE_KEY"
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down --remove-orphans || true

# Limpar imagens antigas (opcional)
read -p "🗑️  Deseja remover imagens antigas? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker system prune -f
    docker image prune -f
fi

# Build e start dos containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up -d --build

# Verificar status dos containers
echo "📊 Verificando status dos containers..."
docker-compose ps

# Aguardar containers ficarem saudáveis
echo "⏳ Aguardando containers ficarem saudáveis..."
sleep 30

# Verificar logs se houver problemas
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Alguns containers falharam ao iniciar. Verificando logs..."
    docker-compose logs --tail=50
    exit 1
fi

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Aplicação disponível em: http://$(curl -s ifconfig.me)"
echo "📊 Para monitorar logs: docker-compose logs -f"
echo "🛑 Para parar: docker-compose down"
