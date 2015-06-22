minutedock
==========

#Install app


1. Install node.js
2. Install mongodb
3. Clone repo and checkout the release branch or download the latest release.
4. run 'npm install'
5. run 'npm install -g gulp'
6. There is config file, app.json at '\<path_to_repo\>/config.default.json'. Override the properties according to environment name.
7. Set use.https to true or false in app.json. Keep it true if you don't have https web server sitting in front of node server.
8. If using https, create ssl certificates. Create ssl key and ssl cert files. Modify app.json and set ssl.key.path and ssl.cert.path
9. Regenerate the required salts and secrets mentioned in app.json. Don't use the defaults.
10. Create google oauth2 credentials and update google.auth.client.id and google.auth.client.secret properties in app.json
11. From '\<path_to_repo\>', execute 'gulp build'
12. From '\<path_to_repo\>' execute 'gulp start'
13. Access https://localhost:\<https_port_configured_in_config_file\>

#Update Selenium Drivers and Run tests
Run 'npm test' from '\<path_to_repo\>'