const crypto = require('crypto')


const options = {
    iterations: 2040,
    keysize: 20,
    encoder: 'sha1'
}
function authorize(body) {
    const users = {
        "test": {
            hash: "37570e0ede59d6929ba55a120b4c665e4d9faed5",
            salt: "746573742d73616c74"
        }
    }
    const options = {
        iterations: 2040,
        keysize: 20,
        encoder: 'sha1'
    }
    var username = JSON.stringify(body.username)
    var client_hash = JSON.stringify(body.client_hash)
    console.log(username)
    serv_hash = crypto.pbkdf2Sync(client_hash, "746573742d73616c74", options.iterations, options.keysize, options.encoder).toString('hex')
    return Promise.resolve(serv_hash === client_hash)
}

var http = require('http');


var server = http.createServer().listen(3000);

server.on('request', function (req, res) {
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });

        req.on('end', function () {
            var post = JSON.parse(body)
            console.log(post);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello World\n');
        });
    }
    if (req.method == 'GET') {

        var header = 200
        var responsebody = ""

        req.on('data', function (data) {
            var body = JSON.parse(data);
            if (body.token != null) {

            } else if (body.token == null && body.client_hash != null) {
                console.log("trying to autorize " + body.username)
                if (authorize(body)) {
                    console.log("Autorized " + body.username)
                    responsebody = "SUCCESSTOKEN"
                } else {
                    console.log("did not autorize" + body.username)
                    header = 401;
                    responsebody = "UNAUTORIZED"
                }
            }

        });

        req.on('end', function () {
            res.writeHead(header, { 'Content-Type': 'text/plain' });
            res.end(responsebody);
        });
    }
});

console.log('Listening on port 3000');
