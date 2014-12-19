var spawn = require('child_process').spawn
var duplexer = require('duplexer')
var through2 = require('through2')
var toArgs = require('./objToArgArray.js')
var streamToTempFile = require('./streamToTempFile.js')

module.exports = function job(inputOpts, outputOpts, soxFile) {
	if (typeof outputOpts !== 'object') {
		soxFile = outputOpts
		outputOpts = inputOpts
		inputOpts = {}
	}
	soxFile = soxFile || 'sox'

	var soxOutputStream = through2()

	var writeStream = streamToTempFile(function (err, tempFilePath, cleanup) {
		if (err) {
			emitErr(err)
		} else {
			var sox = callSox(soxFile, inputOpts, outputOpts, tempFilePath)
			sox.stdout.pipe(soxOutputStream)
			sox.stdout.on('finish', cleanup)
			sox.stderr.on('data', function (chunk) {
				emitErr(new Error(chunk.toString('utf8')))
			})
			sox.on('error', emitErr)
		}

		function emitErr(err) {
			cleanup( duplex.emit.bind(duplex, 'error', err) )
		}
	})

	var duplex = duplexer(writeStream, soxOutputStream)

	return duplex
}

function callSox(soxFile, inputOpts, outputOpts, tempFilePath) {
	var args = [].concat( toArgs(inputOpts), tempFilePath, toArgs(outputOpts), '-' )
	return spawn(soxFile, args)
}
