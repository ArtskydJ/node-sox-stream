var fs = require('fs')
var os = require('os')
var path = require('path')
var once = require('onetime')

module.exports = function (callback) {
	cb = once(callback)
	var tempFilePath = generateTempFilePath()
	var writeStream = fs.createWriteStream( tempFilePath )
	writeStream.once('finish', function () {
		cb(null, tempFilePath, cleanup)
	})
	writeStream.once('error', cb)
	return writeStream

	function cleanup(cb2) {
		fs.unlink(tempFilePath, function (err) {
			cb2 && cb2() //ignore deletion errors
		})
	}
}

function generateTempFilePath() {
	return path.join(os.tmpdir(), Math.random().toString().slice(2))
}
