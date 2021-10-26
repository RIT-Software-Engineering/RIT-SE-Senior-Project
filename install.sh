#!/bin/bash

echo "Updating code..."
sudo git pull
echo "Moving nginx config to /etc/nginx/conf.d/"
sudo cp /home/website/RIT-SE-Senior-Project/nginx/senior-project.conf /etc/nginx/conf.d/
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
# Kill pm2 instead of just stopping main.js beacuse .env changes may not 
# be updated in pm2 without a full restart of pm2.
# sudo pm2 kill
# Start pm2 daemon before starting main.js beacuse otherweise pm2 has a hissy fit and doesn't want to start main properly.
# Random pm2 command just to start pm2 daemon
# sudo pm2 status
sudo pm2 stop prod
echo "Starting pm2"
cd ..
sudo pm2 start /home/website/RIT-SE-Senior-Project/ecosystem.prod.config.js
