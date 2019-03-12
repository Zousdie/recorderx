import { Recorderx } from './recorderx';
import { merge, compress, encodeWAV } from './tools';

export default Recorderx;

export as namespace Recorderx;

export interface tool {
  merge: merge;
  compress: compress;
  encodeWAV: encodeWAV;
}

export { RECORDER_STATE } from './state';
