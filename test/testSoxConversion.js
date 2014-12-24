var test = require('tap').test
var Sox = require('../index.js')
var fs = require('fs')
var crypto = require('crypto')
var concat = require('concat-stream')
var path = require('path')
var os = require('os')

var relativePath = path.join.bind(null, __dirname)
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
	fs.createReadStream(relativePath('audio/test_1.ogg'))
		.pipe(sox)
		.pipe(assertSize(t, 138636))
})

test('ogg > wav - no inputOpts', function (t) {
	var sox = Sox({ t: 'wav' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_1.ogg'))
		.pipe(sox)
		.pipe(assertSize(t, 138636))
})

test('ogg > wav - options - too loud', function (t) {
	t.plan(2)
	var sox = Sox({ type: 'ogg' }, {
		t: 'wav',
		b: 16,
		c: 1,
		r: 44100,
		C: 5
	})
	sox.on('error', function (err) {
		t.ok(/sox WARN rate/.test(err.message), 'error message is a warning')
		t.ok(/clipped/.test(err.message), 'error message says it clipped')
	})
	fs.createReadStream(relativePath('audio/test_2.ogg'))
		.pipe(sox)
		.pipe(assertSize(t, 0)) //this should never get called
})

test('ogg > wav - options - adjusted volume', {timeout: 3000}, function (t) {
	var sox = Sox({
		type: 'ogg',
		v: 0.99
	}, {
		t: 'wav',
		b: 16,
		c: 1,
		r: 44100,
		C: 5
	})
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_2.ogg'))
		.pipe(sox)
		.pipe(assertSize(t, 2724056))
})

test('ogg > mp3', function (t) {
	var sox = Sox({ type: 'ogg' }, { type: 'mp3' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_3.ogg'))
		.pipe(sox)
		.pipe(assertSize(t, 230295))
})

test('wav > flac', function (t) {
	var sox = Sox({ type: 'flac' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_4.wav'))
		.pipe(sox)
		.pipe(assertSize(t, 13993))
})

test('wav > ogg', function (t) {
	var sox = Sox({ type: 'wav' }, { type: 'ogg' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_5.wav'))
		.pipe(sox)
		.pipe(assertSize(t, 18492))
})

test('wav > mp3', function (t) {
	var sox = Sox({ type: 'wav' }, { type: 'mp3' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_6.wav'))
		.pipe(sox)
		.pipe(assertSize(t, 264986))
})

test('flac > ogg', function (t) {
	var sox = Sox({ type: 'ogg' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_7.flac'))
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
