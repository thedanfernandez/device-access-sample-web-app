
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

/** init - Initializes the loaded javascript */
async function init() {
  if(!readQueryString()) {
    readStorage();                // Reads data from browser's local storage if available

  }
  await refreshAccess();        // Retrieves a new access token using refresh token
  initializeWebRTC()
}

/** readStorage - Reads data from browser's local storage if available */
function readStorage() {

  if (localStorage["clientId"]) {
    updateClientId(localStorage["clientId"]);
  }
  if (localStorage["clientSecret"]) {
    updateClientSecret(localStorage["clientSecret"]);
  }

  if (localStorage["refreshToken"]) {
    updateRefreshToken(localStorage["refreshToken"]);
  }

}

function readQueryString() {

  let urlParams = new URLSearchParams(window.location.search);

  if(urlParams.has("useQueryString")) { 
    updateClientId(urlParams.get('clientId'));
    updateClientSecret(urlParams.get('clientSecret'));
    updateRefreshToken(urlParams.get('refreshToken'));
    updateAccessToken(urlParams.get('accessToken'));
    return true
  }
  return false;


}