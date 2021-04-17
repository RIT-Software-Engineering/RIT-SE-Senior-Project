#!/bin/bash

echo "Updating code..."
git pull
echo "Moving nginx config to ~/../../etc/nginx/conf.d/"
sudo cp ~/../website/RIT-SE-Senior-Project/nginx/senior-project.conf ~/../../etc/nginx/conf.d/
echo "Moving tls_params config to ~/../../etc/nginx/conf.d/"
sudo cp ~/../website/RIT-SE-Senior-Project/nginx/tls_params ~/../../etc/nginx/
echo "Installing dependencies"
cd ./server
npm install
cd ../ui
npm install
echo "Building react app"
npm run-script build
cd ..
echo "Stopping nginx"
sudo systemctl stop nginx
echo "Starting nginx"
sudo systemctl start nginx
echo "Stopping pm2"
pm2 stop main
echo "Starting pm2"
pm2 start ./server/main.js
