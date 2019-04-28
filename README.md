# recorderx

Record and export audio in the browser via WebRTC api.

Support output raw, pcm and wav format.

Support Typescript.

---

English | [简体中文](./README-zh_CN.md)

## Check your browser

[Demo](https://zousdie.github.io/recorderx/)

## Install

### NPM

```shell
npm install recorderx --sava
```

### Yarn

```shell
yarn add recorderx
```

## Quick Start

```javascript
import Recorderx, { ENCODE_TYPE } from "recorderx";

const rc = new Recorderx();

// start recorderx
rc.start()
  .then(() => {
    console.log("start recording");
  })
  .catch(error => {
    console.log("Recording failed.", error);
  });

// pause recorderx
rc.pause();

// get wav, a Blob
var wav = rc.getRecord({
  encodeTo: ENCODE_TYPE.WAV,
  compressible: true
});

// get wav, but disable compression
var wav = rc.getRecord({
  encodeTo: ENCODE_TYPE.WAV
});
```

## Usage

### Recorderx constructor

Creates a recorderx instance

- `recordable: boolean`

  Whether to support continuous recording, default to `true`.

- `sampleRate: number`

  Wav sampling rate, default to `16000`.

- `sampleBits: number`

  Wav sampling bits, default to `16`.

  Optional value: `16` or `8`

- `bufferSize: number`

  The buffer size in units of sample-frames, default to `16384`.

  Optional value: `256`, `512`, `1024`, `2048`, `4096`, `8192`, `16384`.

```typescript
interface RecorderxConstructorOptions {
  recordable?: boolean
  bufferSize?: number
  sampleRate?: number
  sampleBits?: number
}

constructor ({ recordable, bufferSize, sampleRate, sampleBits }?: RecorderxConstructorOptions)
```

### Recorderx property

recorder state

```typescript
enum RECORDER_STATE {
  READY,
  RECORDING
}

readonly state: RECORDER_STATE
```

AudioContext instance

```typescript
readonly ctx: AudioContext
```

### Recorderx methods

start recording

`audioprocessCallback`: The onaudioprocess event handler of the ScriptProcessorNode, refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode/onaudioprocess)

`data`: current frame audio data

You can do special processing on the audio data of each frame in this callback function

```typescript
start (audioprocessCallback?: (data: Float32Array) => any): Promise<MediaStream>
```

pause recording

```typescript
pause (): void
```

clear recording buffer

```typescript
clear (): void
```

get recording data

Support for exporting WAV, PCM, RAW

- `encodeTo: ENCODE_TYPE`

  Export format, default to `RAW`.

- `compressible: boolean`

  Whether to enable compression, default to `false`.

  - **If compression is enabled, the exported WAV, PCM, RAW will be compressed data, and the audio sample rate is the `sampleRate` passed in when the `Recorderx` is instantiated.**

  - **If compression is enabled, the exported WAV, PCM, RAW will be compressed data, and the audio sample rate is the `sampleRate` passed in when the `Recorderx` is instantiated.**

  - **The compression algorithm is based on linear extraction and is distorted at some sample rates.**

```typescript
enum ENCODE_TYPE {
  RAW = 'raw',
  PCM = 'pcm',
  WAV = 'wav'
}

/**
 * Get RAW recording data.
 */
getRecord ({ encodeTo, compressible }?: { encodeTo?: ENCODE_TYPE.RAW, compressible?: boolean }): Float32Array

/**
 * Get PCM recording data.
 */
getRecord ({ encodeTo, compressible }?: { encodeTo?: ENCODE_TYPE.PCM, compressible?: boolean }): ArrayBuffer

/**
 * Get WAV recording data.
 */
getRecord ({ encodeTo, compressible }?: { encodeTo?: ENCODE_TYPE.WAV, compressible?: boolean }): Blob
```

### Audio Tools

```javascript
import { audioTools } from "Recorderx";

/*
audioTools.merge();
audioTools.compress();
audioTools.encodeToPCM();
audioTools.encodeToWAV();
*/
```

Merge Float32Array

```typescript
function merge(bufferList: Array<Float32Array>, length: number): Float32Array;
```

Compress Float32Array

```typescript
function compress(
  buffer: Float32Array,
  inputSampleRate: number,
  outputSampleRate: number
): Float32Array;
```

Convert to PCM

```typescript
function encodeToPCM(bytes: Float32Array, sampleBits: number): ArrayBuffer;
```

Convert to WAV

```typescript
function encodeToWAV(
  bytes: Float32Array,
  sampleBits: number,
  sampleRate: number
): Blob;
```

## Browser Support

All browsers that implement `getUserMedia`.

WeChat browser is not supported, only Safari is supported under IOS.

For details, please refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

## License

MIT

## Else

Audio compression and conversion to wav method reference from [recording](https://github.com/silenceboychen/recording.git).
