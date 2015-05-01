var test = require('tape')
var Sox = require('./')
var fs = require('fs')
var crypto = require('crypto')
var concat = require('concat-stream')
var path = require('path')
var os = require('os')
var audioPath = path.dirname( require.resolve('test-audio') )

var relativePath = path.join.bind(null, audioPath)
var originalTmpDirLen = getTmpDirLen()

function getTmpDirLen() {
	return fs.readdirSync(os.tmpdir()).length
}

function closeEnough(x, y) {
	var ratio = x / y
	var diff = Math.abs(ratio - 1)
	return diff < 0.005 //within 5 thousandths of the expected value
}

function assertSize(t, value) {
	return concat(function (buf) {
		t.ok( closeEnough(buf.length, value), buf.length + ' bytes is close enough to ' + value + ' bytes')
		t.end()
	})
}

function handle(t) {
	return function handler(err) {
		var isWarn = /WARN/.test(err.message)
		t.fail(err.message)
		isWarn || t.end()
	}
}

test('ogg > wav', function (t) {
	var sox = Sox( { type: 'ogg' }, { type: 'wav' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('test_1.ogg'))
		.pipe(sox)
		.pipe(assertSize(t, 138636))
})

test('ogg > wav - no inputOpts', function (t) {
	var sox = Sox({ t: 'wav' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('test_1.ogg'))
		.pipe(sox)
		.pipe(assertSize(t, 138636))
})

test('ogg > wav - options - adjusted volume', {timeout: 3000}, function (t) {
	var sox = Sox({
		type: 'ogg',
		v: 0.9
	}, {
		t: 'wav',
		b: 16,
		c: 1,
		r: 44100,
		C: 5
	})
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('test_2.ogg'))
		.pipe(sox)
		.pipe(assertSize(t, 2724056))
})

test('wav > flac', function (t) {
	var sox = Sox({ type: 'flac' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('test_4.wav'))
		.pipe(sox)
		.pipe(assertSize(t, 13993))
})

test('wav > ogg', function (t) {
	var sox = Sox({ type: 'wav' }, { type: 'ogg' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('test_5.wav'))
		.pipe(sox)
		.pipe(assertSize(t, 18492))
})

test('flac > ogg', function (t) {
	var sox = Sox({ type: 'ogg' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('test_7.flac'))
		.pipe(sox)
		.pipe(assertSize(t, 265597))
})

test('cleans up tmp files', function (t) {
	var nowTmpDirLen = getTmpDirLen()
	var diff = Math.abs( originalTmpDirLen - nowTmpDirLen )
	t.ok(diff <= 1, 'tmp dir started with ' + originalTmpDirLen
		+ ' files, and has ' + nowTmpDirLen + ' files now')
	t.end()
})
