#!/bin/bash

echo "Updating code..."
sudo git pull
# echo "Moving nginx config to /etc/nginx/conf.d/"
# sudo cp /home/website/RIT-SE-Senior-Project/nginx/senior-project.conf /etc/nginx/conf.d/
echo "Moving tls_params config to ~/../../etc/nginx/conf.d/"
sudo cp /home/website/RIT-SE-Senior-Project/nginx/tls_params /etc/nginx/
echo "Installing dependencies"
cd /home/website/RIT-SE-Senior-Project/server
sudo npm install
cd /home/website/RIT-SE-Senior-Project/ui
sudo npm install
echo "Building react app"
sudo npm run-script build
echo "Stopping nginx"
sudo systemctl stop nginx
echo "Starting nginx"
sudo systemctl start nginx
echo "Stopping pm2"
sudo pm2 stop main
echo "Starting pm2"
sudo pm2 start /home/website/RIT-SE-Senior-Project/server/main.js
