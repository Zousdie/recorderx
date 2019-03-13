import { RECORDER_STATE } from './state';

export interface Recorderx {
  /**
   * Recorder State.
   */
  state: RECORDER_STATE;

  /**
   * Start recording.
   * @param callback Callback function for onaudioprocess event.
   */
  start(
    callback?: (param?: { data: Float32Array; result: Float32Array; wav: Blob }) => void,
  ): Promise<MediaStream | Error>;

  /**
   * Pause recording.
   */
  pause(): void;

  /**
   * Stop recording and turn off the audio context.
   * This method is equivalent to destroying the current Recorder instance.
   */
  close(): void;

  /**
   * Clear recording buffer.
   */
  clear(): void;

  /**
   * Get recording data.
   * @param param
   * @param param.encodeTo String 'wav' or a function for processing audio data.
   * @param param.compressable Whether to compress. Force compression on wav format.
   */
  getRecord(param?: { encodeTo?: Function | string; compressable: boolean }): Float32Array | Blob;
}

export interface RecorderxConstructor {
  new ({
    recordable,
    sampleRate,
    sampleBits,
    bufferSize,
    numberOfInputChannels,
    numberOfOutputChannels,
  }
  ?: {
  recordable: boolean;
  sampleRate: number;
  sampleBits: number;
  bufferSize: number;
  numberOfInputChannels: number;
  numberOfOutputChannels: number;
  }): Recorderx;
}

declare let Recorderx: RecorderxConstructor;

export default Recorderx;
