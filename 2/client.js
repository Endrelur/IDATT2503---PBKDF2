var http = require('http');
const crypto = require('crypto')


const param = {
    iterations: 2040,
    keyLen: 20,
    digest: 'sha1'
}
var client_password = "password"
var client_username = "Haavlek"
var client_salt = 'salt123' + client_username;
const client_hash = crypto.pbkdf2Sync(client_password, client_salt, param.iterations, param.keyLen, param.digest).toString('hex')


var postData = JSON.stringify({
    client_username,
    client_hash,
});

var options = {
    hostname: 'localhost',
    port: 3000,
    method: 'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
    }
};

var req = http.request(options, function (res) {
    console.log('STATUS:', res.statusCode);
    console.log('HEADERS:', res.headers);

    res.setEncoding('utf8');

    res.on('data', function (chunk) {
        console.log('BODY:', chunk);
    });

    res.on('end', function () {
        console.log('No more data in response.');
    });
});

req.on('error', function (e) {
    console.log('Problem with request:', e.message);
});

req.write(postData);
req.end()