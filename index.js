var spawn = require('child_process').spawn
var duplexer = require('duplexer')
var objToArgArray = require('./objToArgArray.js')

module.exports = function job(options, soxPath) {
	var sox = spawn(soxPath || 'sox', objToArgArray(options))
	var duplex = duplexer(sox.stdin, sox.stdout)
	var emitErr = duplex.emit.bind(duplex, 'error')

	sox.on('error', emitErr)

	sox.stderr.on('data', function (chunk) {
		emitErr(new Error(chunk.toString('utf8')))
	})

	return duplex
}
