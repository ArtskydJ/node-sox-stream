var cp = require('child_process')
var duplexer = require('duplexer')
var toArgs = require('./objToArgArray.js')

module.exports = function job(inputOpts, outputOpts, soxFile) {
	if (typeof outputOpts !== 'object') {
		soxFile = outputOpts
		outputOpts = inputOpts
		inputOpts = {}
	}
	var args = [].concat( toArgs(inputOpts), '-', toArgs(outputOpts), '-' )
	//var soxFile = false
	console.log('args', args)
	var sox = cp.execFile(soxFile || 'sox', args) //was spawn
	var duplex = duplexer(sox.stdin, sox.stdout)
	var emitErr = duplex.emit.bind(duplex, 'err')

	sox.on('error', emitErr)

	sox.stderr.on('data', function (chunk) {
		emitErr(new Error(chunk.toString('utf8')))
	})

	return duplex
}
