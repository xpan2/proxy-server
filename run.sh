#echo server: 8000, proxy server: 8001
#run echo
#curl -v http://127.0.0.1:8000 -d "hello world" -H "x-asdf: foo"

#run proxy: 8001
curl -v http://127.0.0.1:8001 -d "hello world" -H "x-asdf: foo"

#run proxy with google as destination url and without POST
#curl -v http://127.0.0.1:8001 -H "x-asdf: foo"

#run proxy with google.com as x-destination-url 
#curl -v http://127.0.0.1:8001 -H "x-destination-url: http://www.google.com"
