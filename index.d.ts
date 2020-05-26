/// <reference types="node" />

declare namespace Sox {
    export type Combine =
        "concatenate" |
        "sequence" |
        "mix" |
        "mix-power" |
        "merge" |
        "multiply";

    export type Encoding =
        "signed-integer" |
        "unsigned-integer" |
        "floating-point" |
        "mu-law" |
        "a-law" |
        "ima-adpcm" |
        "ms-adpcm" |
        "gsm-full-rate";

    export type Endian =
        "little" |
        "big" |
        "swap";

    export type Effect = string | string[];

    export interface StreamOptions {
        "type"?: string;
        "bits"?: number;
        "encoding"?: Encoding;
        "reverse-nibbles"?: boolean;
        "reverse-bits"?: boolean;
        "endian"?: Endian;
        "channels"?: number;
        "no-glob"?: boolean;
        "rate"?: number;
        "b"?: number;
        "e"?: Encoding;
        "t"?: string;
        "N"?: boolean;
        "X"?: boolean;
        "L"?: boolean;
        "B"?: boolean;
        "x"?: boolean;
        "c"?: number;
        "r"?: number;
    }

    export interface InputOptions extends StreamOptions {
        "ignore-length"?: boolean;
        "volume"?: number;
        "v"?: number;
    }

    export interface OutputOptions extends StreamOptions  {
        "comment"?: string;
        "add-comment"?: string;
        "comment-file"?: string;
        "compression"?: number;
        "C"?: number;
    }

    export interface GlobalOptions {
        "buffer"?: number;
        "combine"?: Combine;
        "mix"?: boolean;
        "no-dither"?: boolean;
        "effects-file"?: string;
        "guard"?: boolean;
        "input-buffer"?: number;
        "norm"?: boolean;
        "play-rate-arg"?: string;
        "plot"?: "gnuplot" | "octave";
        "replay-gain"?: "track" | "album" | "off";
        "single-threaded"?: boolean;
        "temp"?: string;
        "R"?: boolean;
        "M"?: boolean;
        "T"?: boolean;
        "D"?: boolean;
        "G"?: boolean;
    }

    export interface SoxOptions {
        input?: InputOptions;
        output: OutputOptions;
        effects?: Effect[];
        global?: GlobalOptions;
        soxPath?: string;
    }

}

declare function Sox(options: Sox.SoxOptions): NodeJS.ReadWriteStream;

export = Sox;
