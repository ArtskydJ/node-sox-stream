var cp = require('child_process')
var duplexer = require('duplexer')
var toArgs = require('./objToArgArray.js')

module.exports = function job(inputOpts, outputOpts, soxFile) {
	var args = [].concat( toArgs(inputOpts), '-', toArgs(outputOpts), '-' )
	//console.log('args', args)
	var sox = cp.spawn(soxFile || 'sox', args) //was execFile
	var duplex = duplexer(sox.stdin, sox.stdout)
	var emitErr = duplex.emit.bind(duplex, 'err')

	sox.on('error', emitErr)

	sox.stderr.on('data', function (chunk) {
		emitErr(new Error(chunk.toString('utf8')))
	})

	return duplex
}
