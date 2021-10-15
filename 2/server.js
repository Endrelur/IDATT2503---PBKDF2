const crypto = require('crypto')


const options = {
    iterations: 2040,
    keysize: 20,
    encoder: 'sha1'
}
function authorize(body) {
    const users = {
        Haavlek: {
            hash: "1cc126dbfd06311783291a0ed78284cf498546d1",
            salt: "salt123"
        }
    }
    const options = {
        iterations: 2040,
        keysize: 20,
        encoder: 'sha1'
    }

    var user = users[body.client_username]
    var client_hash = JSON.stringify(body.client_hash)
    
    serv_hash = crypto.pbkdf2Sync(client_hash, user.salt, options.iterations, options.keysize, options.encoder).toString('hex')
    
    console.log("Server hash: " + serv_hash)
    console.log("User hash: " + user.hash + "\n")
    
    if(serv_hash === user.hash) {
        return true;
   
    }else {
        return false;
    }
}

var http = require('http');

var server = http.createServer().listen(3000);

server.on('request', function (req, res) {

    if (req.method == 'GET') {

        var header = 200
        var responsebody = ""

        req.on('data', function (data) {
            var body = JSON.parse(data);
            
            if (body.token != null) {

            } else if (body.token == null && body.client_hash != null) {
                console.log("Trying to autorize account: " + body.client_username + "\n")
                
                if (authorize(body)) {
                    console.log("Autorized account: " + body.client_username)
                    responsebody = "Your account has been authorized!"
                
                } else {
                    console.log("Unable to authorize account: " + body.client_username)
                    header = 401;
                    responsebody = "Authorization denied."
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