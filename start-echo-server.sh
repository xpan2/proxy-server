#simple start
#bodemon index.js

#start with host
#bodemon index.js --host www.google.com

#start with host and port - should get no response
bodemon index.js --host www.google.com --port 8000

#start with url
bodemon index.js --url http://www.google.com

#start with log file
bodemon index.js --log=./proxy-server.log
