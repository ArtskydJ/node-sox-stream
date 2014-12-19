var test = require('tap').test
var objToArgArray = require('../objToArgArray.js')

function deepEqual(t, description, obj, expected) {
	t.test(description, function (t) {
		var result = objToArgArray(obj)
		console.log('expected', expected)
		console.log('result', result)
		t.equal(result.length, expected.length, 'lengths are equal')
		expected.forEach(function (r, i) {
			t.notEqual(result.indexOf(r), -1, r + ' expected')
			t.equal(i%2, result.indexOf(r)%2, 'both indexes are ' + (i%2? 'values' : 'arguments'))
		})
		t.end()
	})
}

test('argument building', function (t) {
	deepEqual(t, 'short arguments with number values', {
		x: 2,
		v: 50,
		j: 'hello'
	}, [
		'-x', 2,
		'-v', 50,
		'-j', 'hello'
	])

	deepEqual(t, 'long arguments', {
		rate: 48000,
		bits: 'mp3'
	}, [
		'--bits', 'mp3',
		'--rate', 48000
	])

	t.end()
})
