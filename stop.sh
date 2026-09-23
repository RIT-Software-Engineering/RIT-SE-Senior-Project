#!/bin/bash

echo "Stopping pm2 (express backend)"
pm2 stop main
echo "Stopping nginx (react frontend + reverse proxy to backend)"
sudo systemctl stop nginx
