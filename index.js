var cp = require('child_process')
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

	var writeStream = streamToTempFile(function (err, tempFileName) {
		if (err) {
			emitErr(err)
		} else {
			var sox = callSox(soxFile, inputOpts, outputOpts, tempFileName)
			sox.stdout.pipe(soxOutputStream)
			sox.on('error', emitErr)

			sox.stderr.on('data', function (chunk) {
				emitErr(new Error(chunk.toString('utf8')))
			})
		}
	})

	var duplex = duplexer(writeStream, soxOutputStream)
	
	function emitErr(err) {
		duplex.emit('error', err)
	}

	return duplex
}

function callSox(soxFile, inputOpts, outputOpts, tempFileName) {
	var args = [].concat( toArgs(inputOpts), tempFileName, toArgs(outputOpts), '-' )
	return cp.spawn(soxFile, args)
}



/*
file stream comes in
written to disk
sox converts and writes output to a stream

*/
