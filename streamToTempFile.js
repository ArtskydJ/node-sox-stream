var fs = require('fs')
var os = require('os')
var path = require('path')

module.exports = function (cb) {
	cb = onlyCalledOnce(cb)
	var tempFilePath = generateTempFilePath()
	var writeStream = fs.createWriteStream( tempFilePath )
	writeStream.once('finish', function () {
		cb(null, tempFilePath, cleanup)
	})
	writeStream.once('error', cb)
	return writeStream

	function cleanup(cb) {
		fs.unlink(tempFilePath, function (err) {
			cb && cb() //ignore deletion errors
		})
	}
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
