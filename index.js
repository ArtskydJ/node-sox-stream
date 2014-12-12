var spawn = require('child_process').spawn
var xtend = require('xtend')
var duplexer = require('duplexer')

var soxPath = process.platform == 'win32' ? __dirname + '\\win_libs\\sox.exe' : "sox";
var argMap = {
	channels:   '-c',
	depth:      '-b',
	samplerate: '-r',
	type:       '-t',
	bitrate:    '-C'
}

module.exports = function job(a1, a2, a3) {
	var soxCmd, options, errorCb
	if (typeof a1 === 'string') soxCmd = a1
	if (typeof a1 === 'object') options = a1
	if (typeof a1 === 'function') errorCb = a1

	if (typeof options == 'function') {
		errorCb = options
		options = null
	}

	var opts = xtend({
		depth: 16,
		samplerate: 44100,
		channels: 2,
		type: 'wav'
	}, options)

	var arguments = Object.keys(argMap).reduce(function (args, argument) {
		if (opts[argument] && !(argument == 'depth' && opts.type == 'mp3')) {
			args.push(argMap[argument], opts[argument])
		}
		return args
	}, [])
	
	var sox = spawn(soxCmd, arguments)

	if (errorCb) {
		sox.on('error', errorCb)

		sox.stderr.on('data', function (chunk) {
			var str = chunk.toString('utf8')
			var err = new Error(str.slice(9))
			err.sox = true
			err.warn = /WARN/.test(str)
			errorCb(err)
		})
	}

	return duplexer(sox.stdin, sox.stdout)
}
