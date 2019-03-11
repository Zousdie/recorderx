declare function merge(list: Array<Float32Array>, size: number): Float32Array;

declare function compress(data: Float32Array, inputSampleRate: number, outSampleRate: number): Float32Array;

declare function encodeWAV(bytes: Float32Array, sampleBits: number, sampleRate: number): Blob;

export { merge, compress, encodeWAV };
