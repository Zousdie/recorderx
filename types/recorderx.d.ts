import { RECORDER_STATE, ENCODE_TYPE } from './enum';

export interface RecorderxConstructorOptions {
  recordable?: boolean
  bufferSize?: number
  sampleRate?: number
  sampleBits?: number
}

export default interface Recorderx {
  /**
   * Recorder State
   */
  readonly state: RECORDER_STATE;

  /**
   * AudioContext
   */
  readonly ctx: AudioContext;

  new({ recordable, bufferSize, sampleRate, sampleBits }?: RecorderxConstructorOptions): Recorderx;

  /**
   * Start recording
   * @param callback Callback function for onaudioprocess event
   */
  start (audioprocessCallback?: (data: Float32Array) => any): Promise<MediaStream>;

  /**
   * Pause recording.
   */
  pause (): void;

  /**
   * Clear recording buffer.
   */
  clear (): void;

  /**
   * Get RAW recording data.
   */
  getRecord ({ encodeTo, compressible }?: { encodeTo?: ENCODE_TYPE, compressible?: boolean }): Float32Array;

  /**
   * Get PCM recording data.
   */
  getRecord ({ encodeTo, compressible }?: { encodeTo?: ENCODE_TYPE, compressible?: boolean }): ArrayBuffer;

  /**
   * Get WAV recording data.
   */
  getRecord ({ encodeTo, compressible }?: { encodeTo?: ENCODE_TYPE, compressible?: boolean }): Blob;
}
