These options are copied from the help text displayed when running `sox -h`.

If you want an exhaustive list of each option in depth, take a look at the [SoX docs](http://sox.sourceforge.net/sox.html#OPTIONS).

#GLOBAL OPTIONS

The global options can be passed to `inputOpts` or `outputOpts`, it doesn't matter.

Some options are for multiple files (e.g. `-m`). These will still work, but you must pass in a file name, not a stream.

```
--buffer BYTES                 Set the size of all processing buffers (default 8192)
--clobber                      Don't prompt to overwrite output file (default)
--combine concatenate          Concatenate all input files (default for sox, rec)
--combine sequence             Sequence all input files (default for play)
-D, --no-dither                Don't dither automatically
--effects-file FILENAME        File containing effects and options
-G, --guard                    Use temporary files to guard against clipping
-h, --help                     Display version number and usage information
--help-effect NAME             Show usage of effect NAME, or NAME=all for all
--help-format NAME             Show info on format NAME, or NAME=all for all
--i, --info                    Behave as soxi(1)
--input-buffer BYTES           Override the input buffer size (default: as --buffer)
--no-clobber                   Prompt to overwrite output file
-m, --combine mix              Mix multiple input files (instead of concatenating)
--combine mix-power            Mix to equal power (instead of concatenating)
-M, --combine merge            Merge multiple input files (instead of concatenating)
--norm                         Guard (see --guard) & normalise
--play-rate-arg ARG            Default `rate' argument for auto-resample with `play'
--plot gnuplot|octave          Generate script to plot response of filter effect
-q, --no-show-progress         Run in quiet mode; opposite of -S
--replay-gain track|album|off  Default: off (sox, rec), track (play)
-R                             Use default random numbers (same on each run of SoX)
-S, --show-progress            Display progress while processing audio data
--single-threaded              Disable parallel effects channels processing
--temp DIRECTORY               Specify the directory to use for temporary files
-T, --combine multiply         Multiply samples of corresponding channels from all input files (instead of concatenating)
```

#FORMAT OPTIONS

###input
If format options are passed to `soxInputOpts`, they will be used to interpret the incoming stream. They only *need* to be supplied for files that are headerless.

###Output
If format options are passed to `soxOutputOpts`, they will be used to encode the outgoing stream. (This is the expected use-case.)

When an output option isn't supplied, the output file will have the same format as the input file where possible.

```
-v|--volume FACTOR       Input file volume adjustment factor (real number)
--ignore-length          Ignore input file length given in header; read to EOF
-t|--type FILETYPE       File type of audio
-e|--encoding ENCODING   Set encoding (ENCODING may be one of signed-integer,
                         unsigned-integer, floating-point, mu-law, a-law,
                         ima-adpcm, ms-adpcm, gsm-full-rate)
-b|--bits BITS           Encoded sample size in bits
-N|--reverse-nibbles     Encoded nibble-order
-X|--reverse-bits        Encoded bit-order
--endian little|big|swap Encoded byte-order; swap means opposite to default
-L/-B/-x                 Short options for the above
-c|--channels CHANNELS   Number of channels of audio data; e.g. 2 = stereo
-r|--rate RATE           Sample rate of audio
-C|--compression FACTOR  Compression factor for output format
--add-comment TEXT       Append output file comment
--comment TEXT           Specify comment text for the output file
--comment-file FILENAME  File containing comment text for the output file
--no-glob                Don't `glob' wildcard match the following filename
```
