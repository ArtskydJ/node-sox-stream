sox-stream
==========

A stream-only wrapper around [SoX](http://sox.sourceforge.net/)

Why
===

The other implementations I found were klunky to use; this has an extremely easy-to-use streaming interface.

example
=======

```javascript
var sox = require('sox-stream')
var fs  = require('fs')

var stream = sox({
	depth: 16,          // ouput bitdepth
	samplerate: 44100,  // output samplerate
	channels: 2,        // number of output channels (2 for stereo)
	type: 'wav'         // output file type
})

var src = fs.createReadStream('./original.mp3')
var dst = fs.createWriteStream('./transcoded.wav')

src.pipe(sox).pipe(dst)
```

# API

Install with npm:

```
npm install sox-stream
```


##sox([soxPath], [options], [onError])

- `soxPath` is the command string. If you are on windows, sox is included.
	- If on Windows: If sox's dir is in your system's PATH, you can do `sox.exe`. Defaults to `[this module's path] + '/win_libs/sox.exe'`.
	- If not on Windows: Install sox onto your machine. On some linux distros I think you can do `$ apt-get install sox`. Defaults to `'sox'`.
- `options` is an object, and can be omitted.
	- [`type`](https://en.wikipedia.org/wiki/Audio_file_format) defaults to `'wav'`.
	- [`samplerate`](https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate) defaults to `44100`.
	- [`channels`](https://en.wikipedia.org/wiki/Audio_channel) defaults to `2`.
	- [`depth`](https://en.wikipedia.org/wiki/Audio_bit_depth) defaults to `16`.
	- [`bitrate`](https://en.wikipedia.org/wiki/Bit_rate#MP3) is the bitrate for mp3s.
- `onError` is a function that is called when an error occurs. Note that this might get called multiple times.
	- `err` is the only parameter from `onError`. It is always an error object. If it was from sox, then `err.sox` is true. If it is a warning, then `err.warn` is true.

Returns a transform (a.k.a. through) stream.

(If you don't know how to use streams, I recommend reading the [stream handbook](https://github.com/substack/stream-handbook).)

#credit

Originally forked from [EaterOfCode/sux](https://github.com/EaterOfCode/sux)

#license

[VOL](http://veryopenlicense.com)