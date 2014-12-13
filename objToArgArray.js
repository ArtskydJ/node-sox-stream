module.exports = function args(options) {
	return Object.keys(options).reduce(function (compiled, option) {
		return compiled.concat(prependDashes(option), options[option])
	}, [])
}

function prependDashes(option) {
	return (option.length > 1 ? '--' : '-') + option
}
