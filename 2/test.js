var an = Buffer.from('test-salt', 'utf8').toString('hex');
console.log(an)

var na = Buffer.from(an, 'hex').toString('utf-8')
console.log(na)

const users = {
    "test": {
        hash: "37570e0ede59d6929ba55a120b4c665e4d9faed5",
        salt: "746573742d73616c74"
    }
}

console.log(typeof (users["test"].salt))