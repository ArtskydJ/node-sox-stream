sox-stream
==========

A stream-friendly wrapper around [SoX](http://sox.sourceforge.net/).

Transcode audio streams easily.

why
===

The other implementations I found were klunky to use; this has an extremely easy-to-use streaming interface.

examples
========

```js
var Sox = require('sox-stream')
var fs  = require('fs')

var sox = Sox({
	bits: 16,
	rate: 44100,
	channels: 2,
	type: 'wav'
})

var src = fs.createReadStream('./original.mp3')
var dst = fs.createWriteStream('./transcoded.wav')

src.pipe(sox).pipe(dst)
```

```js
var Sox = require('sox-stream')
var fs  = require('fs')

var sox = Sox({ //input
	volume: 0.8
}, { //output
	channels: 2,
	type: 'mp3'
})

var src = fs.createReadStream('./original.flac')
var dst = fs.createWriteStream('./transcoded.mp3')

src.pipe(sox).pipe(dst)
```

#sox([soxInputOpts], soxOutputOpts, [soxPath])

- `soxInputOpts` is an object, and is optional. These options will be used to interpret the incoming stream.
- `soxOutputOpts` is an object, and is required. You must pass the `type` parameter in. These options will be used to format the outgoing stream.
- `soxPath` is a string of the path to SoX. Optional, defaults to `'sox'`, which works if the SoX binary is in your path. E.g. `'C:\Program Files\Sox\sox.exe'`.

Returns a transform (a.k.a. through) stream. The stream also emits 'error' events when there is an error.

(If you don't know how to use streams, I recommend reading the [stream handbook](https://github.com/substack/stream-handbook).)

###sox features that are not supported
- **effects** - Might support if there is demand for it. Create an issue if you *literally* can't live without this feature. If you're feeling generous, you could make a pull request.
- **file system i/o** - The point of this module is to simplify sox usage. If your use case involves local files, you can use `fs.createReadStream().pipe(sox)`.

#common options

The common options are listed below.

###input and output:

If you use these options on `soxInputOpts`, they will be used to interpret the incoming stream.

Most likely you will want to use these on `soxOutputOpts`. Then they will be used to format the outgoing stream.

- [`b` or `bits`](https://en.wikipedia.org/wiki/Audio_bit_depth), **number**, bit depth. E.g. `16`. (Not applicable to complex encodings such as MP3 or GSM.)
- [`c` or `channels`](https://en.wikipedia.org/wiki/Audio_channel), **number**, number of channels. E.g. `2` for stereo.
- [`r` or `rate`](https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate), **number**, sample rate. E.g. `44100`.
- [`t` or `type`](https://en.wikipedia.org/wiki/Audio_file_format), **string**, file type. E.g. `'wav'`. This property is required by `soxOutputOpts`, and is suggested for `soxInputOpts`.

###input-only:

- `v` or `volume`, **floating point number**, volume adjustment. E.g. `0.8` would make the output stream 80% its original volume (which would be slightly quieter), while `1.0` would preserve the volume.

###output-only

- `C` or `compression`, **integer** usually, compression level. 0 = low compression (large file size).

#uncommon options

I forgot to fill this section out, which is why you're seeing this. Sorry; create an issue if you want me to fix it.

#install

Install with npm: 

```
npm install sox-stream
```

#run tests

To run the tests, you must clone the git repository. You must also have install SoX and put it in your `PATH`.

```
npm test
```

#license

[VOL](http://veryopenlicense.com)
