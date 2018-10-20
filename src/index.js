// compatibility handling
;(function () {
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {}
  }

  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = constraints => {
      const getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia

      if (!getUserMedia) {
        return Promise.reject(
          new Error('getUserMedia is not implemented in this browser')
        )
      }

      return new Promise((resolve, reject) => {
        getUserMedia.call(navigator, constraints, resolve, reject)
      })
    }
  }
})()

const defaultConfig = {
  sampleRate: 16000,
  sampleBits: 16,
  bufferSize: 16384,
  numberOfInputChannels: 1,
  numberOfOutputChannels: 1
}

export const RecorderState = {
  READY: 'ready',
  RECORDING: 'recording',
  DESTROYED: 'destroyed'
}
Object.freeze(RecorderState)

export default class Recorder {
  /**
   * Build a Recorder instance.
   * @param {Boolean} recordable Whether to support continuous recording, 'true' is supported, 'false' is not supported.
   * @param {Object} param1 Recording configuration.
   * Including: 'sampleRate', 'sampleBits' and 'bufferSize'.
   * The default is { sampleRate: 16000, sampleBits: 16, bufferSize: 16384 }.
   */
  constructor (
    recordable = false,
    {
      sampleRate = defaultConfig.sampleRate,
      sampleBits = defaultConfig.sampleBits,
      bufferSize = defaultConfig.bufferSize
    } = defaultConfig
  ) {
    this.sampleRate = sampleRate
    this.sampleBits = sampleBits
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.recorder = this.audioContext.createScriptProcessor(
      bufferSize,
      defaultConfig.numberOfInputChannels,
      defaultConfig.numberOfOutputChannels
    )
    if (recordable) {
      this.xBuffer = []
      this.xSize = 0
    }
    this.recordable = recordable
    this.stream = undefined
    this['#state'] = RecorderState.READY
  }

  /**
   * Start recording, return a Promise.
   * @param {Function} audioprocessCallback Callback function for onaudioprocess event.
   */
  start (audioprocessCallback) {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          this.stream = stream
          const source = this.audioContext.createMediaStreamSource(stream)

          source.connect(this.recorder)
          this.recorder.connect(this.audioContext.destination)

          this.recorder.onaudioprocess = e => {
            const data = e.inputBuffer.getChannelData(0)
            if (this.recordable) {
              this.xBuffer.push(new Float32Array(data))
              this.xSize += data.length
            }
            const result = compress(
              data,
              this.audioContext.sampleRate,
              this.sampleRate
            )
            const wav = encodeWAV(result, this.sampleBits, this.sampleRate)
            if (audioprocessCallback) {
              audioprocessCallback({ wav, result, data })
            }
          }
          this['#state'] = RecorderState.RECORDING
          resolve(stream)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * Recording status
   * READY: 'ready',
   * RECORDING: 'recording',
   * DESTROYED: 'destroyed'
   */
  get state () {
    return this['#state']
  }

  /**
   * Pause recording.
   */
  pause () {
    this.recorder.disconnect()
    this.stream.getAudioTracks()[0].stop()
    this['#state'] = RecorderState.READY
  }

  /**
   * Stop recording and turn off the audio context.
   * This method is equivalent to destroying the current Recorder instance.
   */
  close () {
    this.pause()
    this.clearRecord()
    this['#state'] = RecorderState.DESTROYED
    return this.audioContext.close()
  }

  /**
   * Get a recording in pcm format.
   */
  getRecord () {
    if (this.recordable) {
      return merge(this.xBuffer, this.xSize)
    }
    throw new Error("Configuration doesn't support continuous recording")
  }

  /**
   * Get a recording in wav format.
   */
  getRecordWav () {
    if (this.recordable) {
      const buffer = merge(this.xBuffer, this.xSize)
      const r = compress(buffer, this.audioContext.sampleRate, this.sampleRate)
      const wav = encodeWAV(r, this.sampleBits, this.sampleRate)

      return (window.URL || window.webkitURL).createObjectURL(wav)
    }
    throw new Error("Configuration doesn't support continuous recording")
  }

  /**
   * Clear recording.
   */
  clearRecord () {
    if (this.recordable) {
      this.xBuffer = []
      this.xSize = 0
    }
  }
}

/**
 * data merge
 * @param {Array} list
 * @param {Number} size
 */
function merge (list, size) {
  const data = new Float32Array(size)
  let offset = 0
  for (let i = 0; i < list.length; i += 1) {
    data.set(list[i], offset)
    offset += list[i].length
  }

  return data
}

/**
 * Audio compression.
 * reference from: https://github.com/silenceboychen/recording.git
 * @param {Float32Array} data
 * @param {Number} inputSampleRate
 * @param {Number} outSampleRate
 */

function compress (data, inputSampleRate, outSampleRate) {
  const buffer = new Float32Array(data)
  const compression = parseInt(inputSampleRate / outSampleRate, 10)
  const length = buffer.length / compression
  const resultBuffer = new Float32Array(length)

  let index = 0
  let j = 0
  while (index < length) {
    resultBuffer[index] = buffer[j]
    j += compression
    index += 1
  }

  return resultBuffer
}

/**
 * Convert pcm to wav.
 * reference from: https://github.com/silenceboychen/recording.git
 * @param {Float32Array} bytes
 * @param {Number} sampleBits
 * @param {Number} sampleRate
 */
export function encodeWAV (bytes, sampleBits, sampleRate) {
  const dataLength = bytes.length * (sampleBits / 8)
  const buffer = new ArrayBuffer(44 + dataLength)
  const data = new DataView(buffer)

  const channelCount = 1 // 单声道
  let offset = 0

  const writeString = str => {
    for (let i = 0; i < str.length; i += 1) {
      data.setUint8(offset + i, str.charCodeAt(i))
    }
  }

  // 资源交换文件标识符
  writeString('RIFF')
  offset += 4
  // 下个地址开始到文件尾总字节数,即文件大小-8
  data.setUint32(offset, 36 + dataLength, true)
  offset += 4
  // WAV文件标志
  writeString('WAVE')
  offset += 4
  // 波形格式标志
  writeString('fmt ')
  offset += 4
  // 过滤字节,一般为 0x10
  data.setUint32(offset, 16, true)
  offset += 4
  // 格式类别 (PCM形式采样数据)
  data.setUint16(offset, 1, true)
  offset += 2
  // 通道数
  data.setUint16(offset, channelCount, true)
  offset += 2
  // 采样率,每秒样本数,表示每个通道的播放速度
  data.setUint32(offset, sampleRate, true)
  offset += 4
  // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
  data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true)
  offset += 4
  // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
  data.setUint16(offset, channelCount * (sampleBits / 8), true)
  offset += 2
  // 每样本数据位数
  data.setUint16(offset, sampleBits, true)
  offset += 2
  // 数据标识符
  writeString('data')
  offset += 4
  // 采样数据总数,即数据总大小-44
  data.setUint32(offset, dataLength, true)
  offset += 4
  // 写入采样数据
  if (sampleBits === 8) {
    for (let i = 0; i < bytes.length; i += 1, offset += 1) {
      const s = Math.max(-1, Math.min(1, bytes[i]))
      let val = s < 0 ? s * 0x8000 : s * 0x7fff
      val = parseInt(255 / (65535 / (val + 32768)), 10)
      data.setInt8(offset, val, true)
    }
  } else {
    for (let i = 0; i < bytes.length; i += 1, offset += 2) {
      const s = Math.max(-1, Math.min(1, bytes[i]))
      data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
  }

  return new Blob([data], { type: 'audio/wav' })
}
