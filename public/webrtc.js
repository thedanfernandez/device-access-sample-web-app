
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


// WebRTC Variables:

let localPeerConnection;
let localSendChannel;
let localStream;
var remoteStream;
let offerSDP = "";
let initialized = false;


// WebRTC Configurations:

const localOfferOptions = {
  offerToReceiveVideo: 1,
  offerToReceiveAudio: 1,
};

const mediaStreamConstraints = {
  audio: false,
  video: false,
};



/// WebRTC Functions ///

/** initializeWebRTC - Triggers starting a new WebRTC stream on initialization */
function initializeWebRTC() {
  if(initialized===true)
    return;
  console.log(`initializeWebRTC()`);
  console.log({initializeWebRTC: initialized});
  initialized = true;
  startLocalStream();
}

/** startLocalStream - Starts a WebRTC stream on the browser */
function startLocalStream(mediaStream) {
  console.log(`startLocalStream()`);
  console.log({startLocalStream: mediaStream});
  localPeerConnection = null;
  localSendChannel = null;
  localStream = null;
  offerSDP = "";

  remoteStream = new MediaStream();

  const servers = { 'sdpSemantics': 'unified-plan', 'iceServers': []  };
  localPeerConnection = new RTCPeerConnection(servers);
  localPeerConnection.ondatachannel = receiveChannelCallback;

  localSendChannel = localPeerConnection.createDataChannel('dataSendChannel', null);
  localPeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);

  if(mediaStream) {
    console.log('total tracks: ' + mediaStream.getTracks().length);
    mediaStream.getTracks().forEach((track) => {
      console.log('track: ' + track);
      localPeerConnection.addTrack(track, mediaStream);
      // console.log(`track added!`);
    });
    localStream = mediaStream;
  }

  localPeerConnection.addEventListener('track', gotRemoteMediaTrack);

  console.log('localPeerConnection createOffer start.');
  localPeerConnection.createOffer(localOfferOptions)
      .then(createdOffer).catch(setSessionDescriptionError);
}

/** createdOffer - Handles local offerSDP creation */
function createdOffer(description) {
  console.log(`createdOffer()`);
  console.log({createdOffer: description});
  updateOfferSDP(description.sdp);
  localPeerConnection.setLocalDescription(description)
      .then(() => {
        setLocalDescriptionSuccess(localPeerConnection);
      }).catch(setSessionDescriptionError);
}

/** updateWebRTC - Updates WebRTC connection on receiving answerSDP */
function updateWebRTC(answerSDP) {
 // console.log(`Answer from remotePeerConnection:\n${answerSDP}.`);
  console.log({updateWebRTC: answerSDP});
  if (answerSDP[answerSDP.length - 1] !== '\n') {
    answerSDP += '\n';
  }

  localPeerConnection.setRemoteDescription({ "type": "answer", "sdp": answerSDP })
      .then(() => {
        setRemoteDescriptionSuccess(localPeerConnection);
      }).catch(setSessionDescriptionError);
}



/// Helper Functions ///

/** getPeerName - Handles received peer name */
function getPeerName(peerConnection) {
  console.log(`getPeerName()`);
  console.log({getPeerName : peerConnection});
  return (peerConnection === localPeerConnection) ?
      'localPeerConnection' : 'remotePeerConnection';
}

/** gotRemoteMediaTrack - Handles received media track */
function gotRemoteMediaTrack(event) {
  console.log(`gotRemoteMediaTrack()`);
  console.log({getRemoteMediaTrack: event.track})
  remoteStream.addTrack(event.track);
  document.getElementById("video-stream").srcObject = remoteStream;
}

/** receiveChannelCallback - Handles received channel callback */
const receiveChannelCallback = (event) => {
  console.log('receiveChannelCallback');
  console.log({receiveChannelCallback: event});
  const receiveChannel = event.channel;
  receiveChannel.onmessage = handleReceiveMessage;
};

/** setDescriptionSuccess - Handles received success description */
function setDescriptionSuccess(peerConnection, functionName) {
  console.log(`setDescriptionSuccess()`);
  console.log({setDescriptionSuccess: peerConnection});
  const peerName = getPeerName(peerConnection);
  console.log(`${peerName} ${functionName} complete.`);
}

/** setLocalDescriptionSuccess - Handles received local success description */
function setLocalDescriptionSuccess(peerConnection) {
  console.log(`setLocalDescriptionSuccess()`);
  console.log({setLocalDescriptionSuccess: peerConnection});
  setDescriptionSuccess(peerConnection, 'setLocalDescription');
}

/** setRemoteDescriptionSuccess - Handles received remote success description */
function setRemoteDescriptionSuccess(peerConnection) {
  console.log(`setRemoteDescriptionSuccess()`);
  console.log({setRemoteDescriptionSuccess: peerConnection});
  setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}

/** setSessionDescriptionError - Handles session description error */
function setSessionDescriptionError(error) {
  console.log(`Failed to create session description: ${error.toString()}.`);
}

/** handleLocalMediaStreamError - Handles media stream error */
function handleLocalMediaStreamError(error) {
  console.log(`navigator.getUserMedia error: ${error.toString()}.`);
}

/** handleReceiveMessage - Handles receiving message */
const handleReceiveMessage = (event) => {
  console.log(`Incoming DataChannel push: ${event.data}`);
  console.log({handleReceiveMessage: event});
};

/** handleConnectionChange - Handles connection change */
function handleConnectionChange(event) {
  //console.log('ICE state change event: ', event);
  console.log({handleConnectionChange: event});
}
