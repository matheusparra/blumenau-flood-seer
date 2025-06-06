
# Deploy do Blumenau Flood Seer com Traefik

Este guia específico é para deploy em VPS com Traefik já configurado.

## Pré-requisitos

- VPS com Docker e Docker Compose instalados
- Traefik rodando com rede `bravo-network`
- Domínio `parralab.site` apontando para o servidor
- Portainer (opcional, para gerenciamento visual)

## Configuração Rápida

1. **Clonar e configurar**:
```bash
git clone <seu-repo>
cd blumenau-flood-seer
cp .env.traefik .env
```

2. **Editar arquivo .env**:
```bash
nano .env
```
Configure suas credenciais do Supabase:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

3. **Deploy**:
```bash
chmod +x deploy-traefik.sh
./deploy-traefik.sh
```

## Estrutura do Deploy

### Serviços

- **Frontend**: React + Nginx na porta interna 80
- **Backend**: Flask na porta interna 5000  
- **Simulator**: IoT simulator (opcional, profile `simulator`)

### Roteamento Traefik

- **Frontend**: `https://parralab.site` → Frontend (porta 80)
- **Backend API**: `https://parralab.site/api/*` → Backend (porta 5000)

### Redes

- **bravo-network**: Rede externa do Traefik (comunicação com proxy)
- **internal**: Rede interna entre containers (backend/frontend)

## Comandos Úteis

### Monitoramento
```bash
./monitoring-traefik.sh
```

### Logs
```bash
docker-compose -f docker-compose.traefik.yml logs -f
docker-compose -f docker-compose.traefik.yml logs backend
docker-compose -f docker-compose.traefik.yml logs frontend
```

### Restart
```bash
docker-compose -f docker-compose.traefik.yml restart
docker-compose -f docker-compose.traefik.yml restart backend
```

### Rebuild
```bash
docker-compose -f docker-compose.traefik.yml up -d --build
```

### Simulador IoT (opcional)
```bash
# Ativar
docker-compose -f docker-compose.traefik.yml --profile simulator up -d

# Desativar  
docker-compose -f docker-compose.traefik.yml stop simulator
```

### Cleanup
```bash
docker-compose -f docker-compose.traefik.yml down
docker system prune -f
```

## Troubleshooting

### Verificar rede do Traefik
```bash
docker network ls | grep bravo-network
```

### Verificar labels do Traefik
```bash
docker inspect blumenau-flood-frontend | grep -A 20 Labels
```

### Testar conectividade interna
```bash
docker exec blumenau-flood-frontend wget -O- http://backend:5000/health
```

### Verificar logs do Traefik
```bash
docker logs traefik_traefik.1.<task-id>
```

## SSL/HTTPS

O SSL é gerenciado automaticamente pelo Traefik usando Let's Encrypt:
- Certificados salvos em `/etc/traefik/letsencrypt/acme.json`
- Renovação automática
- Redirecionamento HTTP → HTTPS

## Segurança

- Headers de segurança configurados no Traefik
- Rede interna isolada para backend
- RLS (Row Level Security) habilitado no Supabase
- Logs de acesso completos

## Performance

- Compressão gzip habilitada
- Cache de assets estáticos (1 ano)
- Recursos limitados por container
- Health checks configurados

