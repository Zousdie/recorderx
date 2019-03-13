/**
 * Audio merge, compress and encode.
 *
 * Reference from: https://github.com/silenceboychen/recording.git
 */
export namespace audioTools {
  /**
   * Merge audio data.
   * @param list
   * @param size
   */
  function merge(list: Array<Float32Array>, size: number): Float32Array;

  /**
   * Compression audio data.
   * @param data
   * @param inputSampleRate
   * @param outSampleRate
   */
  function compress(data: Float32Array, inputSampleRate: number, outSampleRate: number): Float32Array;

  /**
   * Convert pcm to wav.
   * @param bytes
   * @param sampleBits
   * @param sampleRate
   */
  function encodeWAV(bytes: Float32Array, sampleBits: number, sampleRate: number): Blob;
}
