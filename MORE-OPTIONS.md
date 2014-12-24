- These options are copied from the help text displayed when running `sox -h`.
- If you want an exhaustive list of each option in depth, take a look at the [SoX docs](http://sox.sourceforge.net/sox.html#OPTIONS).
- Please remember that not all of these options are guaranteed to work with `sox-stream`.
- SoX options that are removed from this list:
	- The options that cause SoX to write to stdout. (E.g. `--help`, `--version`)
	- The options that are for the file system. (E.g. `--clobber`)

#Global Options

- The global options can be passed to `inputOpts` or `outputOpts`, it doesn't matter.
- Some options are for multiple files (e.g. `-m`). These will still work, but you must pass in a file name, not a stream.


###`{buffer: BYTES}`
Set the size of all processing buffers (default 8192)

###`{combine: 'concatenate'}`
Concatenate all input files (default for sox, rec)

###`{combine: 'sequence'}`
Sequence all input files (default for play)

###`{m: true}`
###`{combine: 'mix'}`
Mix multiple input files (instead of concatenating)

###`{combine: 'mix-power'}`
Mix to equal power (instead of concatenating)

###`{M: true}`
###`{combine: 'merge'}`
Merge multiple input files (instead of concatenating)

###`{T: true}`
###`{combine: 'multiply'}`
Multiply samples of corresponding channels from all input files (instead of concatenating)

###`{D: true}`
###`{no-dither: true}`
Don't dither automatically

###`{effects-file: FILENAME}`
File containing effects and options

###`{G: true}`
###`{guard: true}`
Use temporary files to guard against clipping

###`{input-buffer: BYTES}`
Override the input buffer size (default: same as --buffer; 8192)

###`{norm: true}`
Guard (see --guard) & normalise

###`{play-rate-arg: ARG}`
Default `rate` argument for auto-resample with `play'

###`{plot: 'gnuplot'|'octave'}`
Generate script to plot response of filter effect

###`{replay-gain: 'track'|'album'|'off'}`
Default: 'off' (sox, rec), track (play)

###`{R: true}`
Use default random numbers (same on each run of SoX)

###`{single-threaded: true}`
Disable parallel effects channels processing

###`{temp: DIRECTORY}`
Specify the directory to use for temporary files


#Format Options

- If format options are passed to `inputOpts`, they will be used to interpret the incoming stream. They only need to be supplied for files that are headerless.
- If format options are passed to `outputOpts`, they will be used to encode the outgoing stream. (This is the expected use-case.)
- When an output option isn't supplied, the output file will have the same format as the input file where possible.

###`{v: FACTOR}`
###`{volume: FACTOR}`
Input file volume adjustment factor (real number)

###`{ignore-length: true}`
Ignore input file length given in header; read to EOF

###`{t: FILETYPE}`
###`{type: FILETYPE}`
File type of audio

###`{e: ENCODING}`
###`{encoding: ENCODING}`
Set encoding:
- 'signed-integer',
- 'unsigned-integer'
- 'floating-point'
- 'mu-law'
- 'a-law'
- 'ima-adpcm'
- 'ms-adpcm'
- 'gsm-full-rate'

###`{b: BITS}`
###`{bits: BITS}`
Encoded sample size in bits

###`{N: true}`
###`{reverse-nibbles: true}`
Encoded nibble-order

###`{X: true}`
###`{reverse-bits: true}`
Encoded bit-order

###`{endian: 'little'}`
###`{L: true}`
Encoded byte-order; Little endian

###`{endian: 'big'}`
###`{B: true}`
Encoded byte-order; Big endian

###`{endian: 'swap'}`
###`{x: true}`
Encoded byte-order; swap means opposite to default

###`{c: true}`
###`{channels: CHANNELS}`
Number of channels of audio data; e.g. 2 = stereo

###`{r: RATE}`
###`{rate: RATE}`
Sample rate of audio

###`{C: FACTOR}`
###`{compression: FACTOR}`
Compression factor for output format

###`{add-comment: TEXT}`
Append output file comment

###`{comment: TEXT}`
Specify comment text for the output file

###`{comment-file: FILENAME}`
File containing comment text for the output file

###`{no-glob: true}`
Don't `glob' wildcard match the following filename
