module.exports = function args(options) {
	return Object.keys(options).map(function (option) {
		return prependDashes(option) + ' ' + options[option]
	})
}

function prependDashes(option) {
	return (option.length > 1 ? '--' : '-') + option
}
