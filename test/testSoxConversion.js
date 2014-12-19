var test = require('tap').test
var Sox = require('../index.js')
var fs = require('fs')
var crypto = require('crypto')
var concat = require('concat-stream')
var path = require('path')

var relativePath = path.join.bind(null, __dirname)

function assertMd5(t, value) {
	return concat(function (buf) {
		t.equal(buf.toString('hex'), value, 'file was returned as expected')
		t.end()
	})
}

function assertSize(t, value, pct) {
	return concat(function (buf) {
		var percent = buf.length / value * 100
		var percentDiff = Math.abs(percent - 100)
		t.ok(percentDiff < (pct || 2), 'file is right size: ' +
			percent.toString().slice(0, 5) + '%')
		t.end()
	})
}

function assertExactSize(t, value) {
	return concat(function (buf) {
		t.equal(value, buf.length, 'file is right size')
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

test('original file 1 has the correct hash', function (t) {
	fs.createReadStream(relativePath('audio/test_1.ogg'))
		.pipe(crypto.createHash('md5'))
		.pipe(assertMd5(t, '0f9001d81db92eacb862762737383d97'))
})

test('original file 2 has the correct hash', function (t) {
	fs.createReadStream(relativePath('audio/test_2.ogg'))
		.pipe(crypto.createHash('md5'))
		.pipe(assertMd5(t, '8c80fd7a25f1f38f160ea5a31f8ecd36'))
})

test('ogg > wav - short', function (t) {
	var sox = Sox( { type: 'ogg' }, { type: 'wav' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_1.ogg'))
		.pipe(sox)
		.pipe(assertSize(t, 138636))
})

test('ogg > wav - no inputOpts - short', function (t) {
	var sox = Sox({ t: 'wav' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_1.ogg'))
		.pipe(sox)
		.pipe(assertSize(t, 138636))
})

test('ogg > wav - options - short - too loud', function (t) {
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
		.pipe(assertSize(t, 2724056))
})

test('ogg > wav - options - short - adjusted volume', function (t) {
	var sox = Sox({
		type: 'ogg',
		v: 0.999
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

test('ogg > mp3 - long', {timeout: 50000}, function (t) {
	var sox = Sox({ type: 'ogg' }, { type: 'mp3' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_3.ogg'))
		.pipe(sox)
		.pipe(assertSize(t, 3604248))
})

test('wav > ogg - short', function (t) {
	var sox = Sox({ type: 'wav' }, { type: 'ogg' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_5.wav'))
		.pipe(sox)
		.pipe(assertExactSize(t, 18492))
})

test('wav > ogg - long', function (t) {
	var sox = Sox({ type: 'wav' }, { type: 'ogg' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_6.wav'))
		.pipe(sox)
		.pipe(assertSize(t, 3973120, 1))
})

test('wav > mp3 - long', {timeout: 40000}, function (t) {
	var sox = Sox({ type: 'wav' }, { type: 'mp3' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_6.wav'))
		.pipe(sox)
		.pipe(assertSize(t, 4845818, 1))
})

test('flac > ogg - long', {timeout: 40000}, function (t) {
	var sox = Sox({ type: 'flac' }, { type: 'ogg' })
	sox.on('error', handle(t))
	fs.createReadStream(relativePath('audio/test_7.flac'))
		.pipe(sox)
		.pipe(assertSize(t, 3484191, 1))
})
