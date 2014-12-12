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


##sox([soxOpts], [soxPath])
- `soxOpts` is an object, and is optional.
	- [`type`](https://en.wikipedia.org/wiki/Audio_file_format) is a string, e.g. `'wav'`.
	- [`samplerate`](https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate) is a number, e.g. `44100`.
	- [`channels`](https://en.wikipedia.org/wiki/Audio_channel) is a number, e.g. `2` for stereo.
	- [`depth`](https://en.wikipedia.org/wiki/Audio_bit_depth) is a number, e.g. `16`. Note that some 
	- [`bitrate`](https://en.wikipedia.org/wiki/Bit_rate#MP3) is a number for an mp3's bitrate.
- `soxPath` is the command to launch sox; defaults to `sox`.


Returns a transform (a.k.a. through) stream. The stream also emits 'error' events when there is an error.

(If you don't know how to use streams, I recommend reading the [stream handbook](https://github.com/substack/stream-handbook).)

#license

[VOL](http://veryopenlicense.com)