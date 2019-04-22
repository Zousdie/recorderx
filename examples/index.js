import Recorderx, { RECORDER_STATE, ENCODE_TYPE } from '../src/index';

const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnClear = document.getElementById('btn-clear');
const dlog = document.getElementById('log');
const audio = document.getElementById('audio');

function pushLog (log, error = '') {
  const xlog = `<span style="margin-right:8px">
           ${(new Date()).toLocaleString()}:
         </span>
         <span style="color:${error ? 'red' : 'blue'}">
           ${log} ${error}
         </span>`;
  const dl = document.createElement('div');
  dl.innerHTML = xlog;
  dlog.appendChild(dl);
}

let rc;

btnStart.addEventListener('click', () => {
  if (!rc) {
    rc = new Recorderx({
      recordable: true,
      sampleRate: 16000,
    });
  }
  if (rc.state === RECORDER_STATE.READY) {
    rc.start()
      .then(() => {
        pushLog('start recording');
      })
      .catch((error) => {
        pushLog('Recording failed.', error);
      });
  }
});

btnPause.addEventListener('click', () => {
  if (rc && rc.state === RECORDER_STATE.RECORDING) {
    rc.pause();
    audio.src = URL.createObjectURL(rc.getRecord({
      encodeTo: ENCODE_TYPE.WAV,
      compressable: true,
    }));
    pushLog('pause recording');

    console.log(rc.getRecord({ encodeTo: ENCODE_TYPE.RAW }));
    console.log(rc.getRecord({ encodeTo: ENCODE_TYPE.PCM }));
  }
});

btnClear.addEventListener('click', () => {
  rc.clear();
});
