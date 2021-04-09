#!/bin/bash

echo "Starting pm2 (express backend)"
pm2 start ./server/main.js
echo "Starting nginx (react frontend + reverse proxy to backend)"
sudo systemctl start nginx
