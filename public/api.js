const leftCamera = "/enterprises/64cee621-f825-4365-a5d0-046fd6b7a02a/devices/AVPHwEt91Ajn0DOWYiejYtAuz8ePIY7U9luwiczyMiJyHjElP6eWlXdXh2QRvLQWICtpp2VxnSBDCPgAEPwxBr_w9JdtPw"
const rightCamera = "/enterprises/64cee621-f825-4365-a5d0-046fd6b7a02a/devices/AVPHwEtTo_xa7_Vtyq2vRcwYKMLm50LLyigA0BKZfkd5jtPTS38YLjgfryN5tV81xetkSyG8-h6-8WGzvUyCw8dkEmAoaA"
const tokenInterval =  180000 //3min  15000 //15s 
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

// Device Access Variables:
let streamExtensionToken = "";

/** deviceAccessRequest - Issues requests to Device Access Rest API */
function deviceAccessRequest(method, call, localpath, payload = "") {
  let xhr = new XMLHttpRequest();
  xhr.open(method, selectedAPI + localpath);
  xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

  xhr.onload = function () {
    if(xhr.status === 200) {
      let responsePayload = "* Payload: \n" + xhr.response;
      deviceAccessResponse(method, call, xhr.response);
    } else {
      console.error({method, call, localpath, response: xhr.responseText});
    }
  };

  let requestEndpoint = "* Endpoint: \n" + selectedAPI + localpath;
  let requestAuthorization = "* Authorization: \n" + 'Bearer ' + accessToken;
  let requestPayload = "* Payload: \n" + JSON.stringify(payload, null, 4);

  if (method === 'POST' && payload && payload !== "") {
    xhr.send(JSON.stringify(payload));
  } else {
    xhr.send();
  }
}


/** deviceAccessResponse - Parses responses from Device Access API calls */
function deviceAccessResponse(method, call, response) {
  let data = JSON.parse(response);
  // Check if response data is empty:
  if(!data) {
    console.error({method, call, response, message:"Device Access response contains empty response!"});
    return;
  }
  // Based on the original request call, interpret the response:
  switch(call) {
    case 'generateStream':
      console.log("Generate Stream!");
      console.log({test: true, data});
      console.log(`mediaSessionId=${data.results.mediaSessionId}`)
      
      if(data["results"] && data["results"].hasOwnProperty("mediaSessionId"))
        streamExtensionToken = data.results.mediaSessionId;

      if(data["results"] && data["results"].hasOwnProperty("streamExtensionToken"))
        updateStreamExtensionToken(data["results"].streamExtensionToken);
      if(data["results"] && data["results"].hasOwnProperty("answerSdp")) {
        updateWebRTC(data["results"].answerSdp);
      }

      //Start extending stream
      setInterval(extendTokens, tokenInterval )
      break;
    case 'refreshStream':
      console.log("Refresh Stream!");
      if(data["results"] && data["results"].hasOwnProperty("streamExtensionToken"))
        updateStreamExtensionToken(data["results"].streamExtensionToken);
      break;
    case 'stopStream':
      console.log("Stop Stream!");
      initializeWebRTC();
      break;
    default:
      console.error("Error", "Unrecognized Request Call!");
  }
}

/** onGenerateStream_WebRTC - Issues a GenerateWebRtcStream request */
function onGenerateStream_WebRTC(camera) {
  let endpoint = undefined
  if(camera === 'left') {
    endpoint = `${leftCamera}:executeCommand`;
  }
  else {
    endpoint = `${rightCamera}:executeCommand`;
  }

  // console.log(`{onGenerateStream_WebRTC: ${selectedDevice.id}}`);
  //let endpoint = "/enterprises/" + projectId + "/devices/" + selectedDevice.id + ":executeCommand";
  console.log({endpoint: endpoint})
  
  let payload = {
    "command": "sdm.devices.commands.CameraLiveStream.GenerateWebRtcStream",
    "params": {
      "offer_sdp": offerSDP
    }
  };

  deviceAccessRequest('POST', 'generateStream', endpoint, payload);
}

/** onExtendStream_WebRTC - Issues a ExtendWebRtcStream request */
function onExtendStream_WebRTC() {
  // let endpoint = "/enterprises/" + projectId + "/devices/" + selectedDevice.id + ":executeCommand";
  let endpoint = `${rightCamera}:executeCommand`;

  let payload = {
    "command": "sdm.devices.commands.CameraLiveStream.ExtendWebRtcStream",
    "params": {
      "mediaSessionId" : streamExtensionToken
    }
  };
  deviceAccessRequest('POST', 'refreshStream', endpoint, payload);
}

/** onStopStream_WebRTC - Issues a StopWebRtcStream request */
function onStopStream_WebRTC() {
  // let endpoint = "/enterprises/" + projectId + "/devices/" + selectedDevice.id + ":executeCommand";
  let endpoint = `${rightCamera}:executeCommand`;

  let payload = {
    "command": "sdm.devices.commands.CameraLiveStream.StopWebRtcStream",
    "params": {
      "mediaSessionId" : streamExtensionToken
    }
  };
  deviceAccessRequest('POST', 'stopStream', endpoint, payload);
}

/**
 * Get new refresh token and stream token every tokenInterval
 */
async function extendTokens()
{
  console.log(`running extendTokens()`);
  await refreshAccess();        // Retrieves a new access token using refresh token
  onExtendStream_WebRTC() //refreshes stream

}