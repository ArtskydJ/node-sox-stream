var test = require('tap').test
var sox = require('../index.js')
var fs = require('fs')
var crypto = require('crypto')
var concat = require('concat-stream')
var path = require('path')

var relativePath = path.join.bind(null, __dirname)

function assert(t, value, cb) {
	return concat(function (buf) {
		if (typeof value === 'string') {
			t.equal(buf.toString('hex'), value, 'file was returned as expected')
		} else {
			console.log('want:', value, 'got:', buf.length)
			t.ok(buf.length > value - 100, 'file is large enough:' + value)
			t.ok(buf.length < value + 100, 'file is not too large:' + value)
		}
		cb ? cb() : t.end()
	})
}

test('original file 1 has the correct hash', function (t) {
	fs.createReadStream(relativePath('test_1.ogg'))
		.pipe(crypto.createHash('md5'))
		.pipe(assert(t, '0f9001d81db92eacb862762737383d97'))
})

test('original file 2 has the correct hash', function (t) {
	fs.createReadStream(relativePath('test_2.ogg'))
		.pipe(crypto.createHash('md5'))
		.pipe(assert(t, '8c80fd7a25f1f38f160ea5a31f8ecd36'))
})

function handle(t, prepend) {
	if (!prepend) prepend = ''
	return function handler(err) {
		/WARN/.test(err.message) ?
			t.pass(prepend + 'WARNING' + err.message) :
			t.fail(prepend + err.message)
		//t.end()
	}
}

if(0)
test('works as expected with only a type argument', {timeout: 5000}, function (t) {
	var stream = sox(
		{ buffer: 1024, type: 'ogg'}, //, 'ignore-length': '' },
		{ type: 'wav' }
	)
	stream.on('err', handle(t, 'sox-'))
	stream.on('error', handle(t, 'stream-'))

	fs.createReadStream(relativePath('test_1.ogg'))
		.pipe(stream)
		.pipe(fs.createWriteStream(relativePath('test_out_1.wav')))
		//.pipe(assert(t, 138636))
})

test('works as expected with multiple arguments', {timeout: 5000}, function (t) {
	var stream = sox({
		type: 'ogg'
	}, {
		t: 'wav',
		b: 16,
		c: 1,
		r: 44100,
		C: 5
	})
	stream.on('err', handle(t, 'sox-'))
	stream.on('error', handle(t, 'stream-'))

	fs.createReadStream(relativePath('test_2.ogg'))
		.pipe(stream)
		.pipe(fs.createWriteStream(relativePath('test_out_2.wav')))
		//.pipe(assert(t, 2724056))
})
