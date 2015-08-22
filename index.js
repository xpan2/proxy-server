let http = require('http')
let request = require('request')
let argv = require('yargs')
    .default('host', '127.0.0.1')
    .argv
let scheme = 'http://'
let port = argv.port || (argv.host === '127.0.0.1' ? 8000 : 80)
let path = require('path')
let fs = require('fs')
let logPath = argv.log && path.join(__dirname, argv.log)
let logStream = logPath ? fs.createWriteStream(logPath) : process.stdout

http.createServer((req, res) => {
    for (let header in req.headers) {
    	res.setHeader(header, req.headers[header])
    }
    req.pipe(res)
}).listen(8000)

console.log('Listening at http://127.0.0.1:8000')


http.createServer((req, res) => {
    let destinationUrl = req.headers['x-destination-url'] || argv.url || scheme + argv.host + ":" + port

    let options = {
        headers: req.headers,
        url: destinationUrl
    }
    options.method = req.method

    logStream.write(`Proxying request to: ${destinationUrl} \n`)

    let downstreamResponse = req.pipe(request(options))
    logStream.write(JSON.stringify(downstreamResponse.headers))
    logStream.write('\n');
    downstreamResponse.pipe(logStream, {end: false})
    downstreamResponse.pipe(res)

}).listen(8001)
