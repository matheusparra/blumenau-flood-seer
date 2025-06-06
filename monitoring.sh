
#!/bin/bash

# Script de monitoramento para o sistema
echo "🔍 Blumenau Flood Seer - Status do Sistema"
echo "=========================================="

# Verificar status dos containers
echo "📦 Status dos Containers:"
docker-compose ps

echo ""
echo "💾 Uso de Recursos:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

echo ""
echo "🌐 Conectividade:"
echo "Frontend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost/health)"
echo "Backend: $(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health)"

echo ""
echo "📊 Últimos logs do backend:"
docker-compose logs --tail=5 backend

echo ""
echo "🔧 Para monitoramento em tempo real:"
echo "  - Logs: docker-compose logs -f"
echo "  - Stats: docker stats"
echo "  - Restart: docker-compose restart [service]"
