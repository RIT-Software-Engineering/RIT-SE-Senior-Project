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

_**On first login, new user must change password by using the ``passwd`` command**_

### Setup SSH

1. Create SSH keys (There are plenty of tutorials online to do this)
2. Create ssh folder: ``mkdir /home/USERNAME/.ssh``
3. Add your public key to ``/home/USERNAME/.ssh/authorized_keys`` (create file if does not exist)
4. Restart ssh daemon: ``sudo systemctl restart sshd``
5. Add user to pm2 group: ``usermod -aG pm2 USERNAME``
6. Paste ``alias pm2='env HOME=/home/website/RIT-SE-Senior-Project/server pm2'`` into the bottom of ``~/.bashrc``

## Install updates

There is a ``install.sh`` script in the git repo that can be run to install any updates in the git repo.

NOTE: In the git repo, the ``install.sh`` script does not have executable permissions, so on the server, you may need to do a ``chmod +x ./install.sh`` to give it executable permissions. If you change this script, you will need to remove the executable permissions ``chmod -x ./install.sh`` then do a ``git pull`` and then readd the executable permissions with ``chmod +x ./install.sh``

## Technical Information

* We use nginx as a reverse proxy to serve the website. Network requests for both the UI and the server go into nginx and either get redirected to the UI's static files or to endpoints on the server.

* The server is running locally using pm2.

* pm2 is a pain in the butt. If you are having issues with ``.env`` variables not updating, you may need to restart the pm2 daemon by using ``pm2 kill`` to stop the pm2 process and ``pm2 start /home/website/RIT-SE-Senior-Project/server/main.js`` to start it again.

## Project File Structure Info

* Root level (not in /nginx, /server, or /ui) contains files important for deployment of code onto the production and sandbox servers

* /nginx configuration info for the nginx server/reverse proxy

* /server files for the backend

* /ui files for the REACT based frontend