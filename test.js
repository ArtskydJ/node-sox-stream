var test = require('tape')
var Sox = require('./')
var fs = require('fs')
var cp = require('child_process')
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
}

function makeTest(description, soxOpts, file, endSize) {
	test(description, function (t) {
		var soxTransform = Sox(soxOpts)
		soxTransform.on('error', function handler(err) {
			var isWarn = /WARN/.test(err.message)
			t.fail(err.message)
			if (!isWarn) t.end()
		})

		var finished = false
		soxTransform.on('finish', function handler() {
			finished = true
		})

		fs.createReadStream(file.path)
			.pipe(soxTransform)
			.pipe(concat(function close(buf) {
				closeEnough(t, buf.length, endSize, endSize / 200, 'bytes')

				t.notOk(finished, 'stream should not be finished yet')
				setTimeout(function() {
					t.ok(finished, 'stream should be finished')
					t.end()
				}, 200)
			}))
	})
}

test('no options: throw', function (t) {
	t.throws(Sox)
	t.throws(Sox.bind(null, {}))
	t.throws(Sox.bind(null, { output: {}}))
	t.throws(Sox.bind(null, { output: { type: null }}))
	t.end()
})

test('sox is installed on your computer', function (t) {
	t.plan(3)
	cp.exec('sox --version', function (err, stdout, stderr) {
		t.ifError(err)
		t.ifError(stderr)
		t.ok(stdout)
		t.end()
	})
})

makeTest('ogg > ogg', { output: { type: 'ogg' }}, testAudio.ogg, 66031)
makeTest('ogg > wav', { input: { type: 'ogg' }, output: { type: 'wav' }}, testAudio.ogg, 542884)
makeTest('ogg > wav - no inputOpts', { output: { t: 'wav' }}, testAudio.ogg, 542884)
var soxWithManyOptions = {
	input: { type: 'ogg', v: 0.9 },
	output: { t: 'wav', b: 16, c: 1, r: 44100, C: 5 }
}
makeTest('ogg > wav - options - adjusted volume', soxWithManyOptions, testAudio.ogg, 271464) // { timeout: 3000 },
makeTest('wav > flac', { output: { type: 'flac' }}, testAudio.wav, 4711)
makeTest('wav > ogg', { input: { type: 'wav' }, output: { type: 'ogg' }}, testAudio.wav, 5792)
makeTest('flac > ogg', { output: { type: 'ogg' }}, testAudio.flac, 5086)

// github issue #4
test('An incorrect input type does not cause an infinite loop', function (t) {
	var errorCount = 0

	fs.createReadStream(testAudio.wav.path)
		.pipe(Sox({ input: { type: 'ogg' }, output: { type: 'wav' }}))
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
	t.end()
})
