var test = require('tap').test

function deepEqual(t, description, obj, arr) {
	t.test(description, function (t) {
		var args = require('../options.js')
		var result = args(obj)
		t.equal(result.length, arr.length, 'lengths are equal')
		arr.forEach(function (r) {
			t.notEqual(result.indexOf(r), -1, r + ' expected')
		})
		t.end()
	})
}

test('argument parsing', function (t) {
	deepEqual(t, 'short arguments with number values', {
		x: 2,
		v: 50,
		j: 'hello'
	}, [
		'-x 2',
		'-v 50',
		'-j hello'
	])

	deepEqual(t, 'long arguments', {
		rate: 48000,
		bits: 'mp3'
	}, [
		'--rate 48000',
		'--bits mp3'
	])

	t.end()
})
