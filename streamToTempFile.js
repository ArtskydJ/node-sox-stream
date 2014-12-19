var fs = require('fs')
var os = require('os')
var path = require('path')

module.exports = function (cb) {
	cb = onlyCalledOnce(cb)
	var tempFilePath = generateTempFilePath()
	var writeStream = fs.createWriteStream( tempFilePath )
	writeStream.once('finish', function () {
		cb(null, tempFilePath)
	})
	writeStream.once('error', cb)
	return writeStream
}

function generateTempFilePath() {
	return path.join(os.tmpdir(), Math.random().toString().slice(2))
}

function onlyCalledOnce(cb) {
	var calledYet = false
	return function () {
		if (!calledYet) {
			calledYet = true
			cb.apply(null, arguments)
		}
	}
}
