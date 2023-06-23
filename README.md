# St. Innocent's Webapp

> PREDATOR: fastaPi React nExtjs mongoDb beAnie pyThOn typescRipt (ridiculously sweet, i know)

## Admin

CRA application for updating the live site's content, managing inquiries, and viewing analytics.

## Client

Next.js application with incremental static regeneration for top SEO and flexibility.

## Server

FastAPI application using async libraries with MongoDB, Pushover notifications, and JWT authentication.

## Developent

* configure environment (.env used by fastapi for config)
* pipenv install && pipenv shell
* python run.py --dev (-h, --help for options)

## Production

* pull the newest changes from github and update .env if necessary
    * install the client packages with `yarn` (needed for pm2)
* restart the api
    * `systemctl restart api`
* build the client/admin apps and scp them over
    * `scp -r .next root@CLOUD_IP:/root/Playground/st_innocent/client/`
    * `scp -r build/* root@CLOUD_IP:/var/www/admin/`
* copy the client's static files to the www directory
    * `rm -rf /var/www/client/* && cp -r /root/Playground/st_innocent/client/.next/* /var/www/client`
* restart the client & nginx
    * `pm2 restart 0`
    * `systemctl restart nginx`
* to start next.js from scratch (from inside client/)
    * `yarn && pm2 start yarn --name client -- run start`
* to start api service on start 
    * `systemctl enable api`
* to start pm2 on start 
    * `pm2 save`
    * `systemctl enable api`
