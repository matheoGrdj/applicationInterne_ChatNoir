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

echo "✅ Serveur Nuxt démarré et géré par PM2"
pm2 save
