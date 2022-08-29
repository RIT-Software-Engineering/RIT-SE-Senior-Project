COPY .\server\.env.sample .\server\.env
COPY .\ui\.env.sample .\ui\.env
COPY .\server\server\config\rit-cert.pem.sample .\server\server\config\rit-cert.pem
COPY .\server\server\config\seniorproject-key.pem.sample .\server\server\config\seniorproject-key.pem
cd server
call npm install
cd ../ui
call npm install