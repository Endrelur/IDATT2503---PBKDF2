var http = require('http');
const crypto = require('crypto')


const settings = {
    iterations: 2040,
    keysize: 20,
    encoder: 'sha1'
}
var password = "pass"
var username = "test"
const client_salt = 'test-salt';
const client_hash = crypto.pbkdf2Sync(password, client_salt, settings.iterations, settings.keysize, settings.encoder).toString('hex')


var postData = JSON.stringify({
    username,
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