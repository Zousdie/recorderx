# recorderx

Record and export audio in the browser via WebRTC api.

Support output wav and pcm format.

## Install

npm install recorderx -S

## Quick Start

```
import Recorder from 'recorderx'

const rc = new Recorder(true)

const audio = new Audio()
audio.autoplay = true

rc.start()
  .then(stream => {
    audio.srcObject = stream
  })
  .catch(error => alert(error))
```

## Usage

### Constructor

```
const rc = new Recorder([recordable][, config])
```

Creates a recorder instance.

- recordable: (optional)
  - default to `false`
  - Whether to support continuous recording, `true` is supported, `false` is not supported.
  - If you want to continue recording a piece of audio, please use `true`
- config: (optional)
  - Recording configuration object.
    - sampleRate - Wav sampling rate, default to `16000`
    - sampleBits - Wav sampling bits, default to `16`
    - bufferSize - AudioContext buffer size, default to `16384`. Optional value: `256`, `512`, `1024`, `2048`, `4096`, `8192` or `16384`

### Property

#### state

Recording status:

- READY: 'ready'
- RECORDING: 'recording'
- DESTROYED: 'destroyed'

```
import { RecorderState } from 'recorderx'

if (rc.state === RecorderState.READY) {
  ...
}
```

### Methods

#### start([audioprocessCallback])

Start recording, return a Promise, and the promise return the media stream source

- audioprocessCallback: (optional)
  - Callback function for onaudioprocess event.
  - Parameter is an object:
    - wav: Wav format audio data in the current buffer
    - result: Pcm format audio data in the current buffer, compressed
    - data: Raw pcm format data in current buffer

```
rc.start(({ wav, result, data }) => {
  ...
})
  .then(stream => {
    audio.srcObject = stream;
  })
```

#### pause()

Pause recording

```
rc.pause()
```

#### close()

Stop recording and destory the Recorder instance, if `recordable` is `true`, all cached recordings will be cleared

```
rc.close()
```

#### getRecord

Get a recording in pcm format.

```
rc.getRecord()
```

#### getRecordWav

Get a recording in wav format.

```
rc.getRecordWav()
```

#### clearRecord

Clear recording.

```
rc.clearRecord()
```

## Browser Support

All browsers that implement `getUserMedia`.

For details, please refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

## license

MIT

## Else

Audio compression and conversion to wav method reference from [recording](https://github.com/silenceboychen/recording.git)
