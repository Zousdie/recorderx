interface RecorderxConstructorParams {
  recordable: boolean;
  sampleRate: number;
  sampleBits: number;
  bufferSize: number;
  numberOfInputChannels: number;
  numberOfOutputChannels: number;
}

interface audioprocessCallbackParams {
  data: Float32Array;
  result: Float32Array;
  wav: Blob;
}

type audioprocessCallback = (callback: audioprocessCallbackParams) => void;

export class Recorderx {
  constructor(options: RecorderxConstructorParams);

  start: (audioprocessCallback: audioprocessCallback) => Promise<any>;

  pause(): void;

  close(): Primise<any>;

  getRecord(): Float32Array | Blob | null;

  clear(): void;
}
