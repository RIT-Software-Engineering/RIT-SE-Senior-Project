#!/bin/bash

echo "Updaint code..."
git pull
echo "Moving nginx config to ~/../../etc/nginx/conf.d/"
cp ~/RIT-SE-Senior-Project/nginx/senior-project.conf ~/../../etc/nginx/conf.d/
