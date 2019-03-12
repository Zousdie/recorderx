export interface RecorderxConstructorParams {
  recordable: boolean;
  sampleRate: number;
  sampleBits: number;
  bufferSize: number;
  numberOfInputChannels: number;
  numberOfOutputChannels: number;
}

export interface audioprocessCallbackParams {
  data: Float32Array;
  result: Float32Array;
  wav: Blob;
}

export type audioprocessCallback = (callback: audioprocessCallbackParams) => void;

export class Recorderx {
  constructor(options: RecorderxConstructorParams);

  start: (audioprocessCallback: audioprocessCallback) => Promise<any>;

  getRecord(): Float32Array | Blob | null;

  pause(): void;

  close(): Promise<any>;

  clear(): void;
}
