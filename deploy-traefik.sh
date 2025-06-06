
#!/bin/bash

# Script de deploy otimizado para Traefik
set -e

PROJECT_NAME="blumenau-flood-seer"
DOMAIN="parralab.site"

echo "🌊 Iniciando deploy do $PROJECT_NAME para $DOMAIN com Traefik..."

# Verificar se está rodando na VPS com Traefik
if ! docker network ls | grep -q "bravo-network"; then
    echo "❌ Rede 'bravo-network' não encontrada. Verifique se o Traefik está rodando."
    exit 1
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
docker-compose -f docker-compose.traefik.yml down --remove-orphans || true

# Limpar imagens antigas (opcional)
read -p "🗑️  Deseja remover imagens antigas para economizar espaço? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker system prune -f
    docker image prune -f
fi

# Build e start dos containers
echo "🔨 Construindo e iniciando containers..."
docker-compose -f docker-compose.traefik.yml up -d --build

# Verificar status dos containers
echo "📊 Verificando status dos containers..."
docker-compose -f docker-compose.traefik.yml ps

# Aguardar containers ficarem saudáveis
echo "⏳ Aguardando containers ficarem saudáveis..."
sleep 30

# Verificar logs se houver problemas
if ! docker-compose -f docker-compose.traefik.yml ps | grep -q "Up"; then
    echo "❌ Alguns containers falharam ao iniciar. Verificando logs..."
    docker-compose -f docker-compose.traefik.yml logs --tail=50
    exit 1
fi

# Testar conectividade
echo "🌐 Testando conectividade..."
sleep 10

# Verificar se o site está respondendo
if curl -f -s -o /dev/null https://$DOMAIN/health; then
    echo "✅ Frontend está respondendo!"
else
    echo "⚠️  Frontend pode demorar alguns minutos para ficar disponível..."
fi

if curl -f -s -o /dev/null https://$DOMAIN/api/health; then
    echo "✅ Backend API está respondendo!"
else
    echo "⚠️  Backend API pode demorar alguns minutos para ficar disponível..."
fi

echo ""
echo "🎉 Deploy concluído com sucesso!"
echo "🌐 Aplicação disponível em: https://$DOMAIN"
echo "🔌 API disponível em: https://$DOMAIN/api/"
echo ""
echo "📊 Para monitorar:"
echo "  - Logs: docker-compose -f docker-compose.traefik.yml logs -f"
echo "  - Status: docker-compose -f docker-compose.traefik.yml ps"
echo "  - Parar: docker-compose -f docker-compose.traefik.yml down"
echo ""
echo "🎯 Para ativar o simulador IoT (opcional):"
echo "  docker-compose -f docker-compose.traefik.yml --profile simulator up -d"

