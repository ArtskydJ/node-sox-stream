var fs = require('fs')
var file = process.argv[2]
process.stdin.pipe(fs.createWriteStream(file))
