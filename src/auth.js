
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

// Server Credentials:
const TOKEN_ENDPOINT = "https://www.googleapis.com/oauth2/v4/token";
const OAUTH_SCOPE = "https://www.googleapis.com/auth/sdm.service";

// Configuration Variables:
let selectedAPI = "https://smartdevicemanagement.googleapis.com/v1";
let selectedEndpoint = "https://nestservices.google.com/partnerconnections/";
let selectedResourcePicker = "https://sdmresourcepicker.sandbox.google.com/";

// Partner Credentials:
let clientId = "";
let clientSecret = "";

// Authentication Variables:
let accessToken = "";
let refreshToken = "";

/** refreshAccess - Refreshes Access Token using the existing Refresh Token */
function refreshAccess () {
  return new Promise(function (resolve, reject) {
    // Return if there no refresh token:
    // console.log({refreshToken: refreshToken});
    if(!refreshToken) {
      resolve();
      return;
    }

    // Request Payload:
    let payload = {
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token'
    };

    console.log({refreshAccessTokenPayload: payload})

    // Create Http Request:
    let xhr = new XMLHttpRequest();
    xhr.open('POST', TOKEN_ENDPOINT);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    // Http Response Callback:
    xhr.onload = function () {
      if(xhr.status === 200) {  // HTTP OK Response
        // Log Http response:
        let responsePayload = "* Payload: \n" + xhr.responseText;
        // pushLog(LogType.HTTP, "POST Response", responsePayload);

        // Process access token:
        let parsedResponse = JSON.parse(xhr.responseText);
        updateAccessToken(parsedResponse.access_token);
        resolve();
      } else {  // HTTP Error Response
        pushError(LogType.HTTP, "POST Response", xhr.responseText);

        // Invalidate tokens:
        updateAccessToken(undefined);
        updateRefreshToken(undefined);
        resolve();
      }
    };

    // Send Http request:
    xhr.send(JSON.stringify(payload));
  });
}