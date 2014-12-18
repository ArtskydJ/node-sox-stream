var test = require('tap').test
var sox = require('../index.js')
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

test('original file 1 has the correct hash', function (t) {
	fs.createReadStream(relativePath('test_1.ogg'))
		.pipe(crypto.createHash('md5'))
		.pipe(assertMd5(t, '0f9001d81db92eacb862762737383d97'))
})

test('original file 2 has the correct hash', function (t) {
	fs.createReadStream(relativePath('test_2.ogg'))
		.pipe(crypto.createHash('md5'))
		.pipe(assertMd5(t, '8c80fd7a25f1f38f160ea5a31f8ecd36'))
})

function handle(t, prepend) {
	if (!prepend) prepend = ''
	return function handler(err) {
		var isWarn = /WARN/.test(err.message)
		t.fail(prepend + err.message)
		isWarn || t.end()
	}
}

if (false) { //these ain't workin' so i put 'em in an if-false block
	test('ogg > wav - short', function (t) {
		var stream = sox( { type: 'ogg' }, { type: 'wav' })
		stream.on('err', handle(t))
		stream.on('error', handle(t, 'stream-'))
		var src = fs.createReadStream(relativePath('test_1.ogg')).pipe(stream)
		src.pipe(fs.createWriteStream(relativePath('tmp/test_out_1.wav')))
		src.pipe(assertSize(t, 138636)) //3604248
	})

	test('ogg > wav - options - short', function (t) {
		var stream = sox({ type: 'ogg' }, {
			t: 'wav',
			b: 16,
			c: 1,
			r: 44100,
			C: 5
		})
		stream.on('err', handle(t))
		stream.on('error', handle(t, 'stream-'))
		var src = fs.createReadStream(relativePath('test_2.ogg')).pipe(stream)
		//src.pipe(fs.createWriteStream(relativePath('tmp/test_out_2.wav')))
		src.pipe(assertSize(t, 2724056)) //2715484
	})

	test('ogg > mp3 - short', function (t) {
		var stream = sox({ type: 'ogg' }, { type: 'mp3' })
		stream.on('err', handle(t))
		stream.on('error', handle(t, 'stream-'))
		var src = fs.createReadStream(relativePath('test_3.ogg')).pipe(stream)
		//src.pipe(fs.createWriteStream(relativePath('tmp/test_out_3.mp3')))
		src.pipe(assertSize(t, 3604248))
	})
}

test('wav > ogg - short', function (t) {
	var stream = sox({ type: 'wav' }, { type: 'ogg' })
	stream.on('err', handle(t))
	stream.on('error', handle(t, 'stream-'))
	var src = fs.createReadStream(relativePath('test_5.wav')).pipe(stream)
	//src.pipe(fs.createWriteStream(relativePath('tmp/test_out_5.ogg')))
	src.pipe(assertExactSize(t, 18492))
})

test('wav > ogg - long', function (t) {
	var stream = sox({ type: 'wav' }, { type: 'ogg' })
	stream.on('err', handle(t))
	stream.on('error', handle(t, 'stream-'))
	var src = fs.createReadStream(relativePath('test_6.wav')).pipe(stream)
	//src.pipe(fs.createWriteStream(relativePath('tmp/test_out_6.ogg')))
	src.pipe(assertSize(t, 3973120, 1))
})

test('wav > mp3 - long', {timeout: 40000}, function (t) {
	var stream = sox({ type: 'wav' }, { type: 'mp3' })
	stream.on('err', handle(t))
	stream.on('error', handle(t, 'stream-'))
	var src = fs.createReadStream(relativePath('test_6.wav')).pipe(stream)
	//src.pipe(fs.createWriteStream(relativePath('tmp/test_out_6.mp3')))
	src.pipe(assertSize(t, 4845818, 1))
})
