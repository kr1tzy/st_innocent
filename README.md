# St. Innocent

> PREDATOR Stack: fastaPi React nExtjs mongoDb beAnie pyThOn typescRipt

## Applications 

### API

FastAPI application using async libraries with MongoDB, Pushover notifications, and JWT authentication.

### UI

Next.js application with incremental static regeneration for top SEO and flexibility.

### Admin

Vite application for updating the ui's content, managing inquiries, viewing analytics, and more.

## Developent

* configure environment (.env used by fastapi for config)
* pipenv install && pipenv shell
* python run.py --dev (-h, --help for options)

## Production

* pull the newest changes from github and update .env if necessary
    * install the ui packages with `yarn` (needed for pm2)
* restart the api
    * `systemctl restart api`
* get the ui/admin setup
    * `yarn build # ui also builds in cloud`
    * `scp -r .next root@CLOUD_IP:/root/Playground/st_innocent/ui/`
    * `rm -rf /var/www/ui/* && cp -r /root/Playground/st_innocent/ui/.next/* /var/www/ui`
    * `scp -r build/* root@CLOUD_IP:/var/www/admin/`
* restart the ui & nginx
    * `pm2 restart 0`
    * `systemctl restart nginx`
* to start next.js from scratch (from inside ui/)
    * `yarn && pm2 start yarn --name ui -- run start`
* to start api service on start 
    * `systemctl enable api`
* to start pm2 on start 
    * `pm2 save`
    * `systemctl enable api`

---

## Ubuntu (23.10) Cloud Setup

- add droplet ip address to network access on mongo db cloud app

### Packages

- `sudo apt install curl git zsh vim tmux nginx certbot python3-certbot-nginx`
- zsh w/ omz
    - `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
- pyenv
    - `sudo apt install -y build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev openssl`
    - `curl https://pyenv.run | bash`
- nvm
    - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash`

### Python w/ pyenv

- install dependencies for ubuntu version
    - `pyenv update`
    - `pyenv install <version>`
    - `pyenv global <version>`
- pip install --upgrade pip
- pip install pipenv

#### .venv

- inside `/root/Playground/st_innocent/`
- python -m venv .venv
- pipenv install
- pipenv shell

### Node w/ nvm

- nvm install <version>
- npm install --global yarn

### systemd service

- (make sure venv is built with packages installed)
- cp api.service /etc/systemd/system/
- systemctl restart api

## nginx w/ certbot

> don't do too quick! only 5 chances with certbot before an hour delay

- https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04
- cp nginx.conf /etc/nginx/sites-enabled/default
- nginx -t # test it
- systemctl restart nginx
- certbot --nginx

## build the admin and ui app

> Prod API must be running and accessible!

- ui:
    - `yarn build`
    - `cp -r .next/* /var/www/ui/`
- admin:
    - `yarn build`
    - `cp -r build/* /var/www/admin/`

update modes: `chmod -R 755 /var/www/admin && chmod -R 755 /var/www/ui`

#### pm2 

- yarn global add pm2
