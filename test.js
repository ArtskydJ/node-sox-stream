var test = require('tape')
var Sox = require('./')
var fs = require('fs')
var crypto = require('crypto')
var concat = require('concat-stream')
var path = require('path')
var osTmpdir = require('os-tmpdir')
var audioPath = path.dirname( require.resolve('test-audio') )

var tmpFilesThen = getNumOfTmpFiles()

function getNumOfTmpFiles() {
	return fs.readdirSync(osTmpdir()).length
}

function closeEnough(t, got, expect, within, whats) {
	var msg = got + ' ' + whats + ' is close enough to ' + expect + ' ' + whats
	t.ok(Math.abs(got - expect) <= within, msg)
	t.end()
}

function asserting(soxOptsArr, file, endSize) {
	return function (t) {
		t.plan(1)
		var soxTransform = Sox.apply(null, soxOptsArr)
		soxTransform.on('error', function handler(err) {
			var isWarn = /WARN/.test(err.message)
			t.fail(err.message)
			isWarn || t.end()
		})
		var filePath = path.join(audioPath, file)
		fs.createReadStream(filePath)
			.pipe(soxTransform)
			.pipe(concat(function close(buf) {
				closeEnough(t, buf.length, endSize, endSize/200, 'bytes')
			}))
	}
}

test('ogg > wav', asserting([{ type: 'ogg' }, { type: 'wav' }], 'test_1.ogg', 138636 ))
test('ogg > wav - no inputOpts', asserting([{ t: 'wav' }], 'test_1.ogg', 138636 ))
var soxWithManyOptions = [{
	type: 'ogg',
	v: 0.9
}, {
	t: 'wav',
	b: 16,
	c: 1,
	r: 44100,
	C: 5
}]
test('ogg > wav - options - adjusted volume', asserting(soxWithManyOptions, 'test_2.ogg', 2724056 )) // { timeout: 3000 },
test('wav > flac', asserting([{ type: 'flac' }], 'test_4.wav', 13993 ))
test('wav > ogg', asserting([{ type: 'wav' }, { type: 'ogg' }], 'test_5.wav', 18492 ))
test('flac > ogg', asserting([{ type: 'ogg' }], 'test_7.flac', 265597 ))

test('cleans up tmp files', function (t) {
	closeEnough(t, tmpFilesThen, getNumOfTmpFiles(), 1, 'files')
})
