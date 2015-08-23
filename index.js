let http = require('http')
let fs = require('fs')
let path = require('path')
let request = require('request')
let through = require('through')
let argv = require('yargs')
    .default('host', '127.0.0.1')
    .argv
let scheme = 'http://'
let port = argv.port || argv.host === '127.0.0.1' ? 8000 : 80
let destinationUrl = argv.url || scheme + argv.host + ":" + port
let logPath = argv.log && path.join(__dirname, argv.log)
let logStream = logPath ? fs.createWriteStream(logPath) : process.stdout

http.createServer((req, res) => {
    logStream.write('\nEcho request: \n' + JSON.stringify(req.headers))
    for (let header in req.headers) {
    	res.setHeader(header, req.headers[header])
    }
    through(req, logStream, {autoDestroy: false})
    req.pipe(res)
}).listen(8000)

logStream.write('Listening at http://127.0.0.1:8000')

http.createServer((req, res) => {
    let url = req.headers['x-destination-url'] || destinationUrl
    logStream.write(`\nProxying request to: ${url + req.url}`)

    let options = {
        headers: req.headers,
        url: url + req.url
    }
    options.method = req.method

    logStream.write('\nProxy request: \n' + JSON.stringify(req.headers))
    through(req, logStream, {autoDestroy: false})

    let destinationResponse = req.pipe(request(options))

    logStream.write(JSON.stringify(destinationResponse.headers))
    destinationResponse.pipe(res)
    through(destinationResponse, logStream, {autoDestroy: false})

}).listen(8001)
