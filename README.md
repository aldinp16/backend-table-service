# Table Service (Backend)

[![HitCount](http://hits.dwyl.io/aldinp16/backend-table-service.svg)](http://hits.dwyl.io/aldinp16/backend-table-service)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/aldinp16/table-service/issues)
[![Build Status](https://travis-ci.org/aldinp16/backend-table-service.svg?branch=master)](https://travis-ci.org/aldinp16/backend-table-service)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


*Hanya project personal untuk tugas **Uji Kompetensi Keahlian** selama saya bersekolah di "SMK Merdeka Bandung"*. Backend ini dibuat menggunakan [Adonis.js](https://adonisjs.com/) versi 4.1.0 :fire::fire:

## Requirements

- [NodeJS](https://nodejs.org/) `>= 8.0.0`
- [NPM](https://www.npmjs.com/) `>= 3.0`

## Installations

1. `git clone https://github.com/aldinp16/backend-table-service.git`
2. Enter root folder and install package dependency `cd backend-table-service && npm install`
3. Copy .`env` file and set up env variable `mv .env.example .env`
4. Run Migration `node ace migration:run`
5. Run server `node server.js`

> Default database is mysql, but you can change any database in this [list](https://adonisjs.com/docs/4.1/database#_supported_databases)

## Developments

- Run seeder `node ace seed`
- Run test `npm test`
- Linter check `npm lint`
- Fix lint `npm lint:fix`


## User List

Email | Password | Role
----- | -------- | ----
me@aldi.dev | administrator | administrator
waiter@aldi.dev | waiter | waiter
kasir@aldi.dev | kasir | kasir
owner@aldi.dev | owner | owner
pelanggan@aldi.dev | pelanggan | pelanggan

For more about role authorization endpoint, check file `start/routes.js`
