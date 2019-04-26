# recorderx

基于 WebRTC api 的浏览器录音工具库

支持导出 WAV、PCM、RAW 格式

支持 Typescript.

---

[English](./README.md) | 简体中文

## 检查你的浏览器是否支持录音

[Demo](https://zousdie.github.io/recorderx/dist/)

## 安装

### NPM

```shell
npm install recorderx --sava
```

### Yarn

```shell
yarn add recorderx
```

## 快速上手

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
  compressible: true,
});

// get wav, but disable compression
var wav = rc.getRecord({
  encodeTo: ENCODE_TYPE.WAV,
});
```

## 使用

### Recorderx 构造函数

创建实例

- `recordable: boolean`

  是否支持录制, 默认为 `true`.

- `sampleRate: number`

  WAV 采样率, 默认为 `16000`, 推荐使用 `16000`.

- `sampleBits: number`

  WAV 音频深度, 默认为 `16`.

  可选值: `16` or `8`

- `bufferSize: number`

  缓冲区大小，以样本帧为单位, 默认为 `16384`.

  可选值: `256`, `512`, `1024`, `2048`, `4096`, `8192`, `16384`.

```typescript
interface RecorderxConstructorOptions {
  recordable?: boolean
  bufferSize?: number
  sampleRate?: number
  sampleBits?: number
}

constructor ({ recordable, bufferSize, sampleRate, sampleBits }?: RecorderxConstructorOptions)
```

### Recorderx 实例属性

recorder 实例状态

```typescript
enum RECORDER_STATE {
  READY,
  RECORDING
}

readonly state: RECORDER_STATE
```

AudioContext 实例

```typescript
readonly ctx: AudioContext
```

### Recorderx 方法

开始录制

`audioprocessCallback`: ScriptProcessorNode 的 onaudioprocess 事件回调函数，参考 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode/onaudioprocess)

`data`: 当前帧的音频数据

你可以在这个回调中对每一帧的音频数据做特殊处理，例如通过 WebSocket 进行实时音频传输

```typescript
start (audioprocessCallback?: (data: Float32Array) => any): Promise<MediaStream>
```

暂停

```typescript
pause (): void
```

清除录音缓存

```typescript
clear (): void
```

获取录音数据，支持导出 WAV, PCM, RAW

- `encodeTo: ENCODE_TYPE`

  导出的格式，一个枚举类型， 默认为 `RAW`.

- `compressible: boolean`

  是否启用压缩, 默认为 `false`，即禁用压缩.

  - **如果启用压缩，则导出的 WAV, PCM, RAW 将都是被压缩的数据，音频采样率为实例化 `Recorderx` 时传入的 `sampleRate`**

  - **如果禁用压缩，则导出的音频数据的采样率将取决于您的录音设备（一般为 48000 或 44100），而不是在实例化 `Recorderx` 时传入的 `sampleRate`**

  - **压缩算法基于线性抽值，在某些采样率下会失真**

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

合并多个 Float32Array

```typescript
function merge (bufferList: Array<Float32Array>, length: number): Float32Array
```

对 Float32Array 数据进行线性压缩

```typescript
function compress (buffer: Float32Array, inputSampleRate: number, outputSampleRate: number): Float32Array
```

转换为 PCM

```typescript
function encodeToPCM (bytes: Float32Array, sampleBits: number): ArrayBuffer
```

转换为 WAV

```typescript
function encodeToWAV (bytes: Float32Array, sampleBits: number, sampleRate: number): Blob
```

## 浏览器支持

支持所有支持 `getUserMedia` 方法的浏览器

不支持微信浏览器，IOS 下仅支持 Safari

详细信息请参考 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)

## License

MIT

## 其他

音频压缩参考自 [recording](https://github.com/silenceboychen/recording.git).
