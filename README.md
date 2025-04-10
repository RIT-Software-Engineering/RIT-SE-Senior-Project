# Website

| Environment | URL                                      |
| ----------- | ---------------------------------------- |
| Production  | https://seniorproject.se.rit.edu         |
| Test        | https://seniorproject-sandbox.se.rit.edu |

# Server Setup

## Add new developer to production server

Create new user account:

```batch
sudo adduser USERNAME
```

Give user administrative privileges:

```batch
sudo usermod -aG sudo username
```

_**On first login, new user must change password by using the `passwd` command**_

### Setup SSH

1. Create SSH keys (There are plenty of tutorials online to do this)
2. Create ssh folder: `mkdir /home/USERNAME/.ssh`
3. Add your public key to `/home/USERNAME/.ssh/authorized_keys` (create file if does not exist)
4. Restart ssh daemon: `sudo systemctl restart sshd`
5. Add user to pm2 group: `usermod -aG pm2 USERNAME`
6. Paste `alias pm2='env HOME=/home/website/RIT-SE-Senior-Project/server pm2'` into the bottom of `~/.bashrc`

## Install/Develop locally

Run `install.bat` to get dependencies set up locally

Please install the Prettier extension on your IDE ([VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) ([Intelij](https://plugins.jetbrains.com/plugin/10456-prettier)).

## Run locally

In order to get things running locally, you'll need to run `npm start` in both the `./server` and `./ui` folders

## Deploying to prod

After sshing into the server, cd into either prod or test project. Then run according deploy.sh script

## Technical Information

- We use nginx as a reverse proxy to serve the website. Network requests for both the UI and the server go into nginx and either get redirected to the UI's static files or to endpoints on the server.

- The server is running locally using pm2.

- pm2 is a pain in the butt. If you are having issues with `.env` variables not updating, you may need to restart the pm2 daemon by using `pm2 kill` to stop the pm2 process and `pm2 start /home/website/RIT-SE-Senior-Project/server/main.js` to start it again.

- This project uses a git hook that automatically formats code before comitting. The linting is done by `prettier` and is run by `lint-staged` which only runs the linting on staged changes. `husky` is what manages the git hook.

## Project File Structure Info

- Root level (not in /nginx, /server, or /ui) contains files important for deployment of code onto the production and sandbox servers

- /nginx configuration info for the nginx server/reverse proxy

- /server files for the backend

- /ui files for the REACT based frontend

## Backend Documentation
[Swagger Link](https://petstore.swagger.io/?url=https%3A%2F%2Fraw.githubusercontent.com%2FRIT-Software-Engineering%2FRIT-SE-Senior-Project%2Frefs%2Fheads%2Fdev%2Fui%2Fpublic%2Fapi-docs%2Fserver_doc.yaml)
