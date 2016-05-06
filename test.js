var test = require('tape')
var Sox = require('./')
var fs = require('fs')
var concat = require('concat-stream')
var osTmpdir = require('os-tmpdir')
var testAudio = require('test-audio')()

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
			if (!isWarn) t.end()
		})
		fs.createReadStream(file.path)
			.pipe(soxTransform)
			.pipe(concat(function close(buf) {
				closeEnough(t, buf.length, endSize, endSize / 200, 'bytes')
			}))
	}
}

test('ogg > wav', asserting([{ type: 'ogg' }, { type: 'wav' }], testAudio.ogg, 542884 ))
test('ogg > wav - no inputOpts', asserting([{ t: 'wav' }], testAudio.ogg, 542884 ))
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
test('ogg > wav - options - adjusted volume', asserting(soxWithManyOptions, testAudio.ogg, 271464 )) // { timeout: 3000 },
test('wav > flac', asserting([{ type: 'flac' }], testAudio.wav, 4711 ))
test('wav > ogg', asserting([{ type: 'wav' }, { type: 'ogg' }], testAudio.wav, 5792 ))
test('flac > ogg', asserting([{ type: 'ogg' }], testAudio.flac, 5086 ))

// github issue #4
test('An incorrect input type does not cause an infinite loop', function (t) {
	var errorCount = 0

	fs.createReadStream(testAudio.wav.path)
		.pipe(Sox({ type: 'ogg' }, { type: 'wav' }))
		.on('error', function (err) {
			errorCount++
		})

	setTimeout(function () {
		t.ok(errorCount >= 1, 'Received a few errors')
		t.ok(errorCount < 10, 'Did not receive *lots* of errors')
		t.end()
	}, 200)
})

test('cleans up tmp files', function (t) {
	closeEnough(t, tmpFilesThen, getNumOfTmpFiles(), 1, 'files')
})
