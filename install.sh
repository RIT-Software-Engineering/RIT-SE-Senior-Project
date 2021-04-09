#!/bin/bash

echo "Updating code..."
git pull
echo "Moving nginx config to ~/../../etc/nginx/conf.d/"
sudo cp ~/RIT-SE-Senior-Project/nginx/senior-project.conf ~/../../etc/nginx/conf.d/
echo "Installing dependencies"
cd ./server
npm install
cd ../ui
npm install
echo "Building react app"
npm build
cd ..
echo "Stopping nginx"
sudo systemctl stop nginx
echo "Starting nginx"
sudo systemctl start nginx
echo "Stopping pm2"
pm2 stop main
echo "Starting pm2"
pm2 start ./server/main.js
