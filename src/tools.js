export function merge (bufferList, length) {
  const data = new Float32Array(length);

  for (let i = 0, offset = 0; i < bufferList.length; offset += bufferList[i].length, i += 1) {
    data.set(bufferList[i], offset);
  }

  return data;
}

export function compress (buffer, inputSampleRate, outputSampleRate) {
  if (inputSampleRate < outputSampleRate) {
    throw new Error('Invalid parameter: "inputSampleRate" must be greater than "outputSampleRate"');
  }

  const bufferLength = buffer.length;
  inputSampleRate += 0.0;
  outputSampleRate += 0.0;
  const compression = inputSampleRate / outputSampleRate;
  const outLength = Math.ceil(bufferLength * outputSampleRate / inputSampleRate);
  const data = new Float32Array(outLength);

  let s = 0;
  for (let i = 0; i < outLength; i += 1) {
    data[i] = buffer[Math.floor(s)];
    s += compression;
  }

  return data;
}

export function encodeToPCM (bytes, sampleBits) {
  if ([8, 16].indexOf(sampleBits) === -1) {
    throw new Error('Invalid parameter: "sampleBits" must be 8 or 16');
  }

  const dataLength = bytes.length * (sampleBits / 8);
  const buffer = new ArrayBuffer(dataLength);
  const view = new DataView(buffer);

  for (let i = 0, offset = 0; i < bytes.length; i += 1, offset += sampleBits / 8) {
    const s = Math.max(-1, Math.min(1, bytes[i]));
    const val = s < 0 ? s * 0x8000 : s * 0x7fff;
    if (sampleBits === 8) {
      view.setInt8(offset, parseInt(255 / (65535 / (val + 32768)), 10), true);
    } else {
      view.setInt16(offset, val, true);
    }
  }

  return view.buffer;
}

export function encodeToWAV (bytes, sampleBits, sampleRate) {
  if ([8, 16].indexOf(sampleBits) === -1) {
    throw new Error('Invalid parameter: "sampleBits" must be 8 or 16');
  }

  const dataLength = bytes.length * (sampleBits / 8);
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);
  const channelCount = 1;
  let offset = 0;

  const writeString = (str) => {
    for (let i = 0; i < str.length; i += 1) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // WAV HEAD
  writeString('RIFF');
  offset += 4;
  view.setUint32(offset, 36 + dataLength, true);
  offset += 4;
  writeString('WAVE');
  offset += 4;
  writeString('fmt ');
  offset += 4;
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, channelCount, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
  offset += 4;
  view.setUint16(offset, channelCount * (sampleBits / 8), true);
  offset += 2;
  view.setUint16(offset, sampleBits, true);
  offset += 2;
  writeString('data');
  offset += 4;
  view.setUint32(offset, dataLength, true);
  offset += 4;

  // write PCM
  for (let i = 0; i < bytes.length; i += 1, offset += sampleBits / 8) {
    const s = Math.max(-1, Math.min(1, bytes[i]));
    const val = s < 0 ? s * 0x8000 : s * 0x7fff;

    if (sampleBits === 8) {
      view.setInt8(offset, parseInt(255 / (65535 / (val + 32768)), 10), true);
    } else {
      view.setInt16(offset, val, true);
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}
