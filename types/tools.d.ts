/**
 * Audio merge, compress and encode.
 */
export namespace audioTools {
  /**
   * Merge audio data.
   * @param bufferList
   * @param length
   */
  function merge (bufferList: Array<Float32Array>, length: number): Float32Array

  /**
   * Compression audio data.
   * @param buffer
   * @param inputSampleRate
   * @param outputSampleRate
   */
  function compress (buffer: Float32Array, inputSampleRate: number, outputSampleRate: number): Float32Array

  /**
   * Convert RAW to PCM.
   * @param bytes
   * @param sampleBits
   */
  function encodeToPCM (bytes: Float32Array, sampleBits: number): ArrayBuffer

  /**
   * Convert RAW to WAV.
   * @param bytes
   * @param sampleBits
   * @param sampleRate
   */
  function encodeToWAV (bytes: Float32Array, sampleBits: number, sampleRate: number): Blob
}
