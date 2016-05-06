var spawn = require('child_process').spawn
var duplexer = require('duplexer')
var stream = require('stream')
var hashToArray = require('hash-to-array')
var createTempFile = require('create-temp-file')()

module.exports = function job(inputOpts, outputOpts, soxFile) {
	if (typeof outputOpts !== 'object') {
		soxFile = outputOpts
		outputOpts = inputOpts
		inputOpts = {}
	}
	if (!soxFile) soxFile = 'sox'

	var soxOutput = new stream.PassThrough()
	var tmpFile = createTempFile()

	tmpFile.on('error', function (err) {
		// Do not call emitErr/tmpFile.cleanup, or it can create an infinite loop
		duplex.emit('error', err)
	})
	tmpFile.on('finish', function () {
		var sox = callSox(soxFile, inputOpts, outputOpts, tmpFile.path)
		sox.stdout.pipe(soxOutput)
		sox.stdout.on('finish', tmpFile.cleanup.bind(tmpFile)) //tmpFile.cleanup
		sox.stderr.on('data', function (chunk) {
			emitErr(new Error(chunk.toString('utf8')))
		})
		sox.on('error', emitErr)
	})

	function emitErr(err) {
		tmpFile.cleanup(function (err2) {
			duplex.emit('error', err)
		})
	}

	var duplex = duplexer(tmpFile, soxOutput)
	return duplex
}

function callSox(soxFile, inputOpts, outputOpts, tempFilePath) {
	var args = [].concat(
		hashToArray(inputOpts),
		tempFilePath,
		hashToArray(outputOpts),
		'-'
	)
	return spawn(soxFile, args)
}
