import environmentCheck from './polyfill';
import defaultConfig from './config';
import RecorderState from './state';
import {
  merge, compress, encodeWAV, A,
} from './andioProcess';

const state = Symbol('state');

class Recorderx {
  constructor (
    {
      recordable = defaultConfig.recordable,
      sampleRate = defaultConfig.sampleRate,
      sampleBits = defaultConfig.sampleBits,
      bufferSize = defaultConfig.bufferSize,
      numberOfInputChannels = defaultConfig.numberOfInputChannels,
      numberOfOutputChannels = defaultConfig.numberOfOutputChannels,
    } = defaultConfig,
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
    this[state] = RecorderState.READY;
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
          this[state] = RecorderState.RECORDING;
          resolve(stream);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  pause () {
    this[state] = RecorderState.READY;
    this.recorder.disconnect();
    this.stream.getAudioTracks()[0].stop();
  }

  close () {
    this[state] = RecorderState.DESTROYED;
    this.pause();
    this.clear();

    return this.audioContext.close();
  }

  getRecord ({
    compressable = false,
    encodeTo = undefined,
  } = {
    compressable: false,
    encodeTo: undefined,
  }) {
    if (this.recordable) {
      let buffer = merge(this.xBuffer, this.xSize);

      if (compressable) {
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

export default Recorderx;
export { A };
