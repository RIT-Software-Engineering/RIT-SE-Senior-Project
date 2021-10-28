#!/bin/bash

echo "Updating code..."
sudo git pull
#echo "Moving nginx config to /etc/nginx/conf.d/"
#sudo cp /home/website-test/RIT-SE-Senior-Project/nginx/senior-project.conf /etc/nginx/conf.d/
#echo "Moving tls_params config to ~/../../etc/nginx/conf.d/"
#sudo cp /home/website/RIT-SE-Senior-Project/nginx/tls_params /etc/nginx/
echo "Installing dependencies"
cd /home/website-test/RIT-SE-Senior-Project/server
sudo npm install
cd /home/website-test/RIT-SE-Senior-Project/ui
sudo npm install
echo "Building react app"
sudo npm run-script build
cd ..
echo "Stopping nginx"
sudo systemctl stop nginx
echo "Starting nginx"
sudo systemctl start nginx
echo "Stopping pm2"
# Kill pm2 instead of just stopping if there are changes to .env
# sudo pm2 kill
sudo pm2 stop dev
echo "Starting pm2"
sudo pm2 start /home/website-test/RIT-SE-Senior-Project/ecosystem.dev.config.js
