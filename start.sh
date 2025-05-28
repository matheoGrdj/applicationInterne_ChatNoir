#!/bin/bash

echo "🔧 Démarrage du projet Nuxt en mode LAN avec PM2..."

npm install
npm run build

pm2 delete nuxt-lan > /dev/null 2>&1
pm2 start .output/server/index.mjs \
  --name nuxt-lan \
  --interpreter node \
  --time \
  -- \
  --hostname 0.0.0.0 \
  --port 3000

# Récupérer l'IP locale
LOCAL_IP=$(hostname -I | awk '{print $1}')

echo "✅ Serveur Nuxt démarré et géré par PM2"
echo "🌐 Application accessible sur :"
echo "   - Local:   http://localhost:3000"
echo "   - Réseau:  http://$LOCAL_IP:3000"

pm2 save