/**
 * Audio merge, compress and encode
 * reference from: https://github.com/silenceboychen/recording.git
 */

export function merge (list, size) {
  const data = new Float32Array(size);
  let offset = 0;
  for (let i = 0; i < list.length; i += 1) {
    data.set(list[i], offset);
    offset += list[i].length;
  }

  return data;
}

export function compress (data, inputSampleRate, outSampleRate) {
  const buffer = new Float32Array(data);
  const compression = parseInt(inputSampleRate / outSampleRate, 10);
  const length = buffer.length / compression;
  const resultBuffer = new Float32Array(length);

  let index = 0;
  let j = 0;
  while (index < length) {
    resultBuffer[index] = buffer[j];
    j += compression;
    index += 1;
  }

  return resultBuffer;
}

export function encodeWAV (bytes, sampleBits, sampleRate) {
  const dataLength = bytes.length * (sampleBits / 8);
  const buffer = new ArrayBuffer(44 + dataLength);
  const data = new DataView(buffer);

  const channelCount = 1; // 单声道
  let offset = 0;

  const writeString = (str) => {
    for (let i = 0; i < str.length; i += 1) {
      data.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // 资源交换文件标识符
  writeString('RIFF');
  offset += 4;
  // 下个地址开始到文件尾总字节数,即文件大小-8
  data.setUint32(offset, 36 + dataLength, true);
  offset += 4;
  // WAV文件标志
  writeString('WAVE');
  offset += 4;
  // 波形格式标志
  writeString('fmt ');
  offset += 4;
  // 过滤字节,一般为 0x10
  data.setUint32(offset, 16, true);
  offset += 4;
  // 格式类别 (PCM形式采样数据)
  data.setUint16(offset, 1, true);
  offset += 2;
  // 通道数
  data.setUint16(offset, channelCount, true);
  offset += 2;
  // 采样率,每秒样本数,表示每个通道的播放速度
  data.setUint32(offset, sampleRate, true);
  offset += 4;
  // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
  data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
  offset += 4;
  // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
  data.setUint16(offset, channelCount * (sampleBits / 8), true);
  offset += 2;
  // 每样本数据位数
  data.setUint16(offset, sampleBits, true);
  offset += 2;
  // 数据标识符
  writeString('data');
  offset += 4;
  // 采样数据总数,即数据总大小-44
  data.setUint32(offset, dataLength, true);
  offset += 4;
  // 写入采样数据
  if (sampleBits === 8) {
    for (let i = 0; i < bytes.length; i += 1, offset += 1) {
      const s = Math.max(-1, Math.min(1, bytes[i]));
      let val = s < 0 ? s * 0x8000 : s * 0x7fff;
      val = parseInt(255 / (65535 / (val + 32768)), 10);
      data.setInt8(offset, val, true);
    }
  } else {
    for (let i = 0; i < bytes.length; i += 1, offset += 2) {
      const s = Math.max(-1, Math.min(1, bytes[i]));
      data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
  }

  return new Blob([data], { type: 'audio/wav' });
}
