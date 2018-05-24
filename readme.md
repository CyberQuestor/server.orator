# Welcome to Haystack.One bot platform
Here is how you setup environment to develop and run this project.

- Either use `apt get` or `homebrew` to install following
    - `Nodejs` (8.0 LTA recommended)
    - `npm` package manager (6.0.1 recommended)
    - `redis-server` (3.2 and above recommended)
- Run following commands if it is first time setup;
    - `npm install restify --save` (one time, not during setup)
    - `npm install -g localtunnel` (during one time setup also, use lt --port 3050)
    - `npm install command-line-args --save`
    - `npm install botkit-storage-redis --save`
- If it is pulled from `git`, following should suffice;
    - `npm install`
    - `npm install -g localtunnel`
- Generate MS bot appid and p/w while setting of _bot channel registry_ at Azure portal and populate `.env` file
- Run node as;
    - `node . -ls yourdomainhere` or,
    - `node .` and `lt --port 3050 --subdomain yourdomainhere`
- Use following endpoints for access (unless changed);
    - [http://localhost:3005](http://localhost:3005) for web-plugin
    - [http://localhost:8089](http://localhost:8089) for trumpet
    - [http://yourdomain.localtunnel.me/botframework/receive](http://yourdomain.localtunnel.me/botframework/receive) or [http://localhost:3050/botframework/receive](http://localhost:3050/botframework/receive) for MS bot framework

# Utilities
Some commands that will help you maintain project.

- Maintain packages
    - Use `npm outdated` to see which modules have newer versions
    - Use `npm update` (without a package name) to update all modules
    - `npm update botkit` to update botkit to latest version
