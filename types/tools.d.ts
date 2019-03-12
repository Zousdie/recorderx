export type merge = (list: Array<Float32Array>, size: number) => Float32Array;

export type compress = (data: Float32Array, inputSampleRate: number, outSampleRate: number) => Float32Array;

export type encodeWAV = (bytes: Float32Array, sampleBits: number, sampleRate: number) => Blob;
