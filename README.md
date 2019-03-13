# recorderx

Record and export audio in the browser via WebRTC api.

Support output wav and pcm format.

## Check your browser

[Demo](https://zousdie.github.io/recorderx/demo/)

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
import Recorderx from "recorderx";

const rc = new Recorderx({
  recordable: true
});

const audio = new Audio();
audio.autoplay = true;

rc.start()
  .then(stream => {
    audio.srcObject = stream;
  })
  .catch(error => {
    //
  });
```

## Usage

### Constructor

```javascript
const rc = new Recorderx([options]);
```

Creates a recorderx instance.

- `recordable: boolean`

  Whether to support continuous recording, default to `false`.

  If you want to record a piece of audio, please use `true`.

- `sampleRate: number`

  Wav sampling rate, default to `16000`.

- `sampleBits: number`

  Wav sampling bits, default to `16`.

- `bufferSize: number`

  The buffer size in units of sample-frames, default to `16384`.

  If specified, the bufferSize must be one of the following values: 256, 512, 1024, 2048, 4096, 8192, 16384.

- `numberOfInputChannels: number`

  Integer specifying the number of channels for this node's input, defaults to 1.

  Values of up to 32 are supported.

- `numberOfOutputChannels: number`

  Integer specifying the number of channels for this node's output, defaults to 1.

  Values of up to 32 are supported.

### Property

#### state

Recording status, an enum:

- READY: 0

- RECORDING: 1

- DESTROYED: 2

```javascript
import { RECORDER_STATE } from "recorderx";

if (rc.state === RECORDER_STATE.READY) {
  //
}
```

### Methods

#### start([callback])

Start recording, return a Promise, and the promise return the media stream source.

```javascript
rc.start(({ wav, result, data }) => {
  ...
})
  .then((stream) => {
    audio.srcObject = stream;
  });
```

- callback (optional)

  Callback function for onaudioprocess event.

- callback parameter is an object:

  - data: Raw pcm format data in current buffer.

  - result: Pcm format audio data in the current buffer, compressed.

  - wav: Wav format audio data in the current buffer.

#### pause

Pause recording.

#### close

Stop recording and turn off the audio context.

This method is equivalent to destroying the current Recorder instance.

#### clear

Clear recording buffer.

#### getRecord(options)

Get recording data.

```javascript
rc.getRecord({ encodeTo: "wav" });
```

- options (optional)

  Options object

  - encodeTo

    String 'wav' or a function for processing audio data.

  - compressable

    Whether to compress. Force compression on wav format.

## Browser Support

All browsers that implement `getUserMedia`.

For details, please refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

## license

MIT

## Else

Audio compression and conversion to wav method reference from [recording](https://github.com/silenceboychen/recording.git).
