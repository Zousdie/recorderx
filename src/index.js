import {
  merge,
  compress,
  encodeWAV,
} from './tools';
import environmentCheck from './polyfill';
import DEFAULT_CONFIG from './config';
import RECORDER_STATE from './state';

const state = '_state';

class Recorderx {
  constructor (
    {
      recordable = DEFAULT_CONFIG.recordable,
      sampleRate = DEFAULT_CONFIG.sampleRate,
      sampleBits = DEFAULT_CONFIG.sampleBits,
      bufferSize = DEFAULT_CONFIG.bufferSize,
      numberOfInputChannels = DEFAULT_CONFIG.numberOfInputChannels,
      numberOfOutputChannels = DEFAULT_CONFIG.numberOfOutputChannels,
    } = DEFAULT_CONFIG,
  ) {
    this.recordable = recordable;
    this.sampleRate = sampleRate;
    this.sampleBits = sampleBits;

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.recorder = this.audioContext.createScriptProcessor(
      bufferSize,
      numberOfInputChannels,
      numberOfOutputChannels,
    );

    if (recordable) {
      this.xBuffer = [];
      this.xSize = 0;
    }

    this.stream = undefined;
    this[state] = RECORDER_STATE.READY;
  }

  get state () {
    return this[state];
  }

  start (audioprocessCallback) {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.stream = stream;
          const source = this.audioContext.createMediaStreamSource(stream);

          source.connect(this.recorder);
          this.recorder.connect(this.audioContext.destination);

          this.recorder.onaudioprocess = (e) => {
            const data = e.inputBuffer.getChannelData(0);

            if (this.recordable) {
              this.xBuffer.push(new Float32Array(data));
              this.xSize += data.length;
            }

            const result = compress(
              data,
              this.audioContext.sampleRate,
              this.sampleRate,
            );
            const wav = encodeWAV(result, this.sampleBits, this.sampleRate);

            if (audioprocessCallback) {
              audioprocessCallback({ data, result, wav });
            }
          };
          this[state] = RECORDER_STATE.RECORDING;
          resolve(stream);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  pause () {
    this[state] = RECORDER_STATE.READY;
    this.recorder.disconnect();
    this.stream.getAudioTracks()[0].stop();
  }

  close () {
    this[state] = RECORDER_STATE.DESTROYED;
    this.pause();
    this.clear();

    return this.audioContext.close();
  }

  getRecord ({
    encodeTo = undefined,
    compressable = false,
  } = {
    compressable: false,
    encodeTo: undefined,
  }) {
    if (this.recordable) {
      let buffer = merge(this.xBuffer, this.xSize);

      if (encodeTo === 'wav' || compressable) {
        buffer = compress(buffer, this.audioContext.sampleRate, this.sampleRate);
      }

      if (typeof encodeTo === 'function') {
        buffer = encodeTo(buffer, {
          sampleBits: this.sampleBits,
          sampleRate: this.sampleRate,
        });
      } else if (encodeTo === 'wav') {
        buffer = encodeWAV(buffer, this.sampleBits, this.sampleRate);
      }

      return buffer;
    }

    return null;
  }

  clear () {
    if (this.recordable) {
      this.xBuffer = [];
      this.xSize = 0;
    }
  }
}

environmentCheck();

export const tools = {
  merge,
  compress,
  encodeWAV,
};
export { RECORDER_STATE };
export default Recorderx;
