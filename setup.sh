
#!/bin/bash

# Script de setup inicial para o projeto
echo "🌊 Blumenau Flood Seer - Setup Inicial"
echo "======================================"

# Verificar se está executando como root
if [ "$EUID" -eq 0 ]; then 
    echo "❌ Não execute este script como root"
    exit 1
fi

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar dependências necessárias
echo "🔧 Instalando dependências..."
sudo apt install -y curl wget git ufw fail2ban

# Configurar firewall básico
echo "🛡️ Configurando firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Instalar Docker se não estiver instalado
if ! command -v docker &> /dev/null; then
    echo "🐳 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Instalar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "🔧 Instalando Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo de configuração..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANTE: Edite o arquivo .env com suas configurações do Supabase!"
    echo "   - SUPABASE_URL=sua_url_aqui"
    echo "   - SUPABASE_SERVICE_KEY=sua_chave_aqui"
    echo ""
fi

# Tornar scripts executáveis
chmod +x *.sh

echo "✅ Setup inicial concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Edite o arquivo .env com suas configurações"
echo "2. Execute: ./deploy.sh para fazer o deploy"
echo "3. Execute: ./monitoring.sh para monitorar o sistema"
echo ""
echo "🔄 Faça logout e login novamente para aplicar as permissões do Docker"
