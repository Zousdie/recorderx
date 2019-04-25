import {
  merge,
  compress,
  encodeToPCM,
  encodeToWAV,
} from './tools';
import environmentCheck from './polyfill';
import DEFAULT_CONFIG from './config';
import { RECORDER_STATE, ENCODE_TYPE } from './enum';

class Recorderx {
  state = RECORDER_STATE.READY

  ctx = new (window.AudioContext || window.webkitAudioContext)()

  sampleRate = DEFAULT_CONFIG.sampleRate

  sampleBits = DEFAULT_CONFIG.sampleBits

  recordable = DEFAULT_CONFIG.recordable

  recorder = null

  source = null

  stream = null

  buffer = []

  bufferSize = 0

  constructor (
    {
      recordable = DEFAULT_CONFIG.recordable,
      bufferSize = DEFAULT_CONFIG.bufferSize,
      sampleRate = DEFAULT_CONFIG.sampleRate,
      sampleBits = DEFAULT_CONFIG.sampleBits,
    } = DEFAULT_CONFIG,
  ) {
    const { ctx } = this;
    const creator = ctx.createScriptProcessor || ctx.createJavaScriptNode;
    this.recorder = creator.call(ctx, bufferSize, 1, 1);
    this.recordable = recordable;
    this.sampleRate = sampleRate;
    this.sampleBits = sampleBits;
  }

  start (audioprocessCallback) {
    this.ctx.resume();

    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const { recorder } = this;
          const source = this.ctx.createMediaStreamSource(stream);

          this.stream = stream;
          this.source = source;

          recorder.onaudioprocess = (e) => {
            const channelData = e.inputBuffer.getChannelData(0);

            if (this.recordable) {
              this.buffer.push(channelData.slice(0));
              this.bufferSize += channelData.length;
            }

            if (typeof audioprocessCallback === 'function') {
              audioprocessCallback(channelData);
            }
          };

          source.connect(recorder);
          recorder.connect(this.ctx.destination);

          this.state = RECORDER_STATE.RECORDING;

          resolve(stream);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  pause () {
    this.stream.getAudioTracks()[0].stop();
    this.recorder.disconnect();
    this.source.disconnect();
    this.ctx.suspend();
    this.state = RECORDER_STATE.READY;
  }

  clear () {
    this.buffer = [];
    this.bufferSize = 0;
  }

  getRecord ({
    encodeTo = ENCODE_TYPE.RAW,
    compressible = false,
  } = {
    encodeTo: ENCODE_TYPE.RAW,
    compressible: false,
  }) {
    if (this.recordable) {
      let buffer = merge(this.buffer, this.bufferSize);

      const inputSampleRate = this.ctx.sampleRate;
      compressible = compressible && (this.sampleRate < inputSampleRate);
      const outSampleRate = compressible ? this.sampleRate : inputSampleRate;

      if (compressible) {
        buffer = compress(buffer, inputSampleRate, outSampleRate);
      }

      switch (encodeTo) {
        case ENCODE_TYPE.RAW:
          return buffer;
        case ENCODE_TYPE.PCM:
          return encodeToPCM(buffer, this.sampleBits);
        case ENCODE_TYPE.WAV:
          return encodeToWAV(buffer, this.sampleBits, outSampleRate);
        default:
          throw new Error('Invalid parameter: "encodeTo" must be ENCODE_TYPE');
      }
    }

    throw new Error('Configuration error: "recordable" must be set to true');
  }
}

environmentCheck();

export const audioTools = {
  merge,
  compress,
  encodeToPCM,
  encodeToWAV,
};
export { RECORDER_STATE, ENCODE_TYPE };
export default Recorderx;
