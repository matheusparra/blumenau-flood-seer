
#!/bin/bash

# Script de backup para dados importantes
BACKUP_DIR="/var/backups/blumenau-flood-seer"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 Iniciando backup do sistema..."

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup dos dados
echo "📁 Backup dos dados..."
tar -czf "$BACKUP_DIR/data_$DATE.tar.gz" Data/ logs/ .env

# Backup das configurações
echo "⚙️ Backup das configurações..."
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" docker-compose*.yml Dockerfile* nginx.conf *.sh

# Limpar backups antigos (manter apenas últimos 7 dias)
echo "🗑️ Limpando backups antigos..."
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup concluído em $BACKUP_DIR"
echo "📊 Espaço usado pelos backups:"
du -sh $BACKUP_DIR
