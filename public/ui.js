
/* Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**************** RECORDING ****************/
let mediaRecorder;
let recordedBlobs;

const recordButton = document.getElementById('record');
const videoStreamEl = document.getElementById('video-stream');

const downloadButton = document.getElementById('download');
recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Record') {
    startRecording();
  } else {
    stopRecording();
    recordButton.textContent = 'Record';
    // playButton.disabled = false;
    downloadButton.disabled = false;
  }
});

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function stopRecording() {
  mediaRecorder.stop();
}

function startRecording() {
  recordedBlobs = [];
  // let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  let options = {mimeType: 'video/webm;codecs=h264,opus'};

  try {
    console.log(remoteStream)
    mediaRecorder = new MediaRecorder(remoteStream, options);
    //mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }
  
  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';

  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.mp4';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

/**************** END RECORDING ****************/

//New Button to start Stream
const startStreamButton = document.getElementById('startStream');
startStreamButton.addEventListener('click', startStream);

function startStream() {
  let urlParams = new URLSearchParams(window.location.search);
  onGenerateStream_WebRTC( urlParams.get('camera'))
}

/// UI Controller Functions - Buttons ///



function updateOfferSDP(value) {
  console.log({updateOfferSDP: value});
  offerSDP = value;
  // document.getElementById("txtOfferSDPCamera").value = offerSDP;
  // document.getElementById("txtOfferSDPDoorbell").value = offerSDP;
}

