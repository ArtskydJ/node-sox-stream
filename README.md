sox-stream
==========

A stream-only wrapper around [SoX](http://sox.sourceforge.net/).

Specifically for transcoding audio files.

why
===

The other implementations I found were klunky to use; this has an extremely easy-to-use streaming interface.

example
=======

```js
var sox = require('sox-stream')
var fs  = require('fs')

var stream = sox({  //input:
	t: 'mp3'
}, {                //output:
	bits: 16,
	rate: 44100,
	channels: 2,
	type: 'wav'
})

//Don't set encodings unless you know what you're doing:
var src = fs.createReadStream('./original.mp3')
var dst = fs.createWriteStream('./transcoded.wav')

src.pipe(sox).pipe(dst)
```

#install

Install with npm:

```
npm install sox-stream
```

To run the tests, you must have sox in your `PATH`.

```
npm test
```


#sox([soxInputOpts], soxOutputOpts, [soxFile])

- `soxInputOpts` is an object, and is optional. These options will be used to interpret the incoming stream.
- `soxOutputOpts` is an object, and is required. You must pass the `type` parameter in. These options will be used to format the outgoing stream.
- `soxFile` is the command to launch sox. This can be a path to sox. Optional, defaults to `'sox'`, which works if the sox binary is in your path. E.g. `'C:\Program Files\Sox\sox'`.

###sox features that are not supported
- **effects** - Might support if there is demand for it. Create an issue if you *literally* can't live without this feature. If you're feeling generous, you could make a pull request, but I don't want unnecessary complications in the interface.
- **multiple input streams** - Can not be done, as far as I know. Not even when using sox straight from the command line.

*If your head will literally explode without this feature, create an issue, and I'll see what I can do.
**

Returns a transform (a.k.a. through) stream. The stream also emits 'error' events when there is an error.

(If you don't know how to use streams, I recommend reading the [stream handbook](https://github.com/substack/stream-handbook).)



#common options

The common options are listed below.

###input and output:

If you use these options on `soxInputOpts`, they will be used to interpret the incoming stream.

Most likely you will want to use these on `soxOutputOpts`. Then they will be used to format the outgoing stream.

- [`b` or `bits`](https://en.wikipedia.org/wiki/Audio_bit_depth), **number**, bit depth. E.g. `16`. (Not applicable to complex encodings such as MP3 or GSM.)
- [`c` or `channels`](https://en.wikipedia.org/wiki/Audio_channel), **number**, number of channels. E.g. `2` for stereo.
- [`r` or `rate`](https://en.wikipedia.org/wiki/Sampling_(signal_processing)#Sampling_rate), **number**, sample rate. E.g. `44100`.
- [`t` or `type`](https://en.wikipedia.org/wiki/Audio_file_format), **string**, file type. E.g. `'wav'`. This property is required by `soxOutputOpts`.

###input-only:

- `v` or `volume`, **floating point number**, volume adjustment. E.g. `0.8` would make the output stream 80% as loud (which would be slightly quieter), while `1.0` wouldn't change the volume.

###output-only

- `C` or `compression`, **[floating point] number**, compression level, 0=low.

#uncommon options



#running tests


#license

[VOL](http://veryopenlicense.com)
