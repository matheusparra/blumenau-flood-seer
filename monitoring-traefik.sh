
#!/bin/bash

# Script de monitoramento para o sistema com Traefik
DOMAIN="parralab.site"

echo "🔍 Blumenau Flood Seer - Status do Sistema ($DOMAIN)"
echo "=================================================="

# Verificar status dos containers
echo "📦 Status dos Containers:"
docker-compose -f docker-compose.traefik.yml ps

echo ""
echo "💾 Uso de Recursos:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" blumenau-flood-frontend blumenau-flood-backend blumenau-flood-simulator 2>/dev/null || docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" blumenau-flood-frontend blumenau-flood-backend

echo ""
echo "🌐 Conectividade External:"
echo -n "Frontend (https://$DOMAIN): "
if curl -f -s -o /dev/null -w "%{http_code}" https://$DOMAIN/health; then
    echo "✅ OK"
else
    echo "❌ ERRO"
fi

echo -n "Backend API (https://$DOMAIN/api/health): "
if curl -f -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/health; then
    echo "✅ OK"
else
    echo "❌ ERRO"
fi

echo ""
echo "🔌 Conectividade Interna:"
echo -n "Frontend interno: "
docker exec blumenau-flood-frontend wget -q --spider http://localhost/health 2>/dev/null && echo "✅ OK" || echo "❌ ERRO"

echo -n "Backend interno: "
docker exec blumenau-flood-backend python -c "import requests; requests.get('http://localhost:5000/health', timeout=5)" 2>/dev/null && echo "✅ OK" || echo "❌ ERRO"

echo ""
echo "📊 Últimos logs do backend:"
docker-compose -f docker-compose.traefik.yml logs --tail=5 backend

echo ""
echo "🔧 Comandos úteis:"
echo "  - Logs completos: docker-compose -f docker-compose.traefik.yml logs -f"
echo "  - Stats em tempo real: docker stats"
echo "  - Restart: docker-compose -f docker-compose.traefik.yml restart [service]"
echo "  - Rebuild: docker-compose -f docker-compose.traefik.yml up -d --build [service]"
echo ""
echo "🎯 Para ativar/desativar simulador:"
echo "  - Ativar: docker-compose -f docker-compose.traefik.yml --profile simulator up -d"
echo "  - Desativar: docker-compose -f docker-compose.traefik.yml stop simulator"

