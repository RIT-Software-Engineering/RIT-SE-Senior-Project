#!/bin/bash

echo "Starting server in the background"
cd ./server
npm start &
echo "Starting UI in the background"
cd ../ui
npm start &
echo ""
