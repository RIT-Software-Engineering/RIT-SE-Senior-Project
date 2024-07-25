cp ./server/.env.sample ./server/.env
cp ./ui/.env.sample ./ui/.env
cp ./server/server/config/rit-cert.pem.sample ./server/server/config/rit-cert.pem
cp ./server/server/config/seniorproject-key.pem.sample ./server/server/config/seniorproject-key.pem
cd server
npm install
cd ../ui
npm install