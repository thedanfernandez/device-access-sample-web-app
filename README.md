# Device Access Web Application Sample

![Device Access Logo](https://www.gstatic.com/images/branding/product/2x/googleg_64dp.png)

Device Access enables access, control, and management of Nest devices within partner apps, solutions, and smart home ecosystems, using the Smart Device Management (SDM) API.

Developers can use the code in this repository with the directions provided below to deploy a functioning web application to control Nest cameras, doorbells, and thermostats.

If you are new to Device Access, we recommend you to start with the [Building a Device Access Web Application Codelab](https://developers.google.com/nest/device-access/codelabs/web-app).


## Deploying the Sample App

After creating a project on [Firebase](https://firebase.google.com/), use the steps below to deploy the sample app.

Clone the sample app:

`git clone https://github.com/google/device-access-sample-web-app.git`

Navigate into project directory:

`cd device-access-sample-web-app`

Link the app with your Firebase project:

`firebase use --add [PROJECT-ID]`

Deploy the app to your Firebase project:

`firebase deploy`

You can then access the app at your Hosting URL ([https://[PROJECT-ID].web.app](#)).

## Using the Sample App

Enter the OAuth credentials you created on [Google Cloud Platform](https://console.cloud.google.com/), as well as the Project Id from [Device Access Console](https://console.nest.google.com/device-access/) to complete the account linking flow for a Google account with a linked Nest device.

Make sure to add the redirect url `[PROJECT-ID].web.app/auth` in list of authorized URLs for your Client Id on Google Cloud Platform to prevent `Error 400: redirect_url_mismatch`. More instructions on this can be found at [Handling OAuth](https://developers.google.com/nest/device-access/codelabs/web-app#4) section from the [Building a Device Access Web Application Codelab](https://developers.google.com/nest/device-access/codelabs/web-app).

You can try out a live demo at [device-access-sample.web.app](https://device-access-sample.web.app/).

### Local

- Add Authorized Redirect URI
- Set hosting emulator port if needed in firebase.json

```json
  "emulators": {
    "hosting": {
      "host": "localhost",
      "port": "5001"
    }
  },
```

- Run locally `firebase emulators:start`


### Cameras

Rink Deck
- name: /enterprises/64cee621-f825-4365-a5d0-046fd6b7a02a/devices/AVPHwEtTo_xa7_Vtyq2vRcwYKMLm50LLyigA0BKZfkd5jtPTS38YLjgfryN5tV81xetkSyG8-h6-8WGzvUyCw8dkEmAoaA

Rink Tower
- name: /enterprises/64cee621-f825-4365-a5d0-046fd6b7a02a/devices/AVPHwEt91Ajn0DOWYiejYtAuz8ePIY7U9luwiczyMiJyHjElP6eWlXdXh2QRvLQWICtpp2VxnSBDCPgAEPwxBr_w9JdtPw

Office Camera
- name: /enterprises/64cee621-f825-4365-a5d0-046fd6b7a02a/devices/AVPHwEszqe2aDh24oxHWkBAFMJjGUyPVmUW1BTG4Thly3HVnGxNv5wdUYX1KKETbyz4YMoJezBSeUqmkPivEC7Ej1fYp_g

### Order of operations

### Account Linking SIGN IN
- set 

Client ID: [CLIENT_ID].apps.googleusercontent.com
Secret: [SECRET]
Device Project ID: [PROJECT_ID]


* Data kept in local stoarage (ui.js update* methods)
clientId
clientSecret
ProjectId
oauthCode
isSignedIn


Order of operations
- index.html-init()
- app.js-init()
  - readStorage();                // Reads data from browser's local storage if available
  - await handleAuth();           // Checks incoming authorization code from /auth path
    - //URL http://localhost:5001/auth
    - '?state=pass-through%20value', 
    - 'code=4/0AX4XfWjmw2bxgB0iWyrHJp6XkAKRqp2GQu3DXk12qptfjvE88OkxWd8CRXCL9F00BhYtYw'
    - 'scope=https://www.googleapis.com/auth/sdm.service'

    - updateOauthCode(val)
      - 4/0AX4XfWjmw2bxgB0iWyrHJp6XkAKRqp2GQu3DXk12qptfjvE88OkxWd8CRXCL9F00BhYtYw
  - await exchangeCode();         // Exchanges authorization code to an access token
    - xhr.onload()                //Sends payload / code / etc to get access_token and refresh_token
    - updateAccessToken()
    - updateRefreshToken()
    - updatedSignedIn()
  - await refreshAccess();        // Retrieves a new access token using refresh token
    - xhr.onload()
    - updateAccessToken
  - initializeDevices();          // Issues a list devices call if logged-in
    - ui.js-clickListDevices()
    - onListDevices()
    - api.js-deviceAccessRequest       // List devices
- ui.js-clickSignIn()
- ui.js-signIn() - form submission
- auth.js-signIn()
- auth.js-exchangeCode()
- xhr.onload - Post request to token endpoint
- updateAccessToken
- updateRefreshToken
- updateSignedIn
  - updateSubscribed(false)
  - updateAppControls
- resolve
- 
### Nest Tutorial

Tutorial - https://developers.google.com/nest/device-access/authorize


Open the following link in a web browser, replacing:

project-id with your Device Access Project ID
oauth2-client-id with the OAuth2 Client ID from your Google Cloud Platform (GCP) Credentials

https://nestservices.google.com/partnerconnections/project-id/auth?redirect_uri=https://www.google.com&access_type=offline&prompt=consent&client_id=oauth2-client-id&response_type=code&scope=https://www.googleapis.com/auth/sdm.service


## Called with Parameters
https://nestservices.google.com/partnerconnections/64cee621-f825-4365-a5d0-046fd6b7a02a/auth?redirect_uri=https://www.google.com&access_type=offline&prompt=consent&client_id=495755512033-cs2183p8dof8393a4k4u7rtiehhct1ta.apps.googleusercontent.com&response_type=code&scope=https://www.googleapis.com/auth/sdm.service

## Access Token request
https://www.googleapis.com/oauth2/v4/token?client_id=495755512033-cs2183p8dof8393a4k4u7rtiehhct1ta.apps.googleusercontent.com&client_secret=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&code=4/0AX4XfWhgGrzA63eR_anSrN2Hfgrtx51V5Dl59nCJ7khAMjYu_tUs5sgrHz4EoKFNUI6omQ&grant_type=authorization_code&redirect_uri=https://www.google.com

## See this

https://www.google.com/?code=4/0AX4XfWhgGrzA63eR_anSrN2Hfgrtx51V5Dl59nCJ7khAMjYu_tUs5sgrHz4EoKFNUI6omQ&scope=https://www.googleapis.com/auth/sdm.service 

Code: 4/0AX4XfWhgGrzA63eR_anSrN2Hfgrtx51V5Dl59nCJ7khAMjYu_tUs5sgrHz4EoKFNUI6omQ
Code: 4/0AX4XfWgYaTq3B1It8WwZ0k1J9cBQOlyrVBSbMuHziBo7-4obhGwlSCZ_z8aTesec41Afpg

https://nestservices.google.com/partnerconnections/64cee621-f825-4365-a5d0-046fd6b7a02a/auth?access_type=offline&client_id=495755512033-cs2183p8dof8393a4k4u7rtiehhct1ta.apps.googleusercontent.com&include_granted_scopes=true&prompt=consent&redirect_uri=http%3A%2F%2Flocalhost%3A5001%2Fauth&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fsdm.service&state=pass-through+value

## WebRTC

- Generate Stream (api.js 132)
- updateWebRTC (webrtc.js 103)
- ice state change event (webrtc 182)
- handleConnectionChange (webrtc 183)
- gotRemoteMediaTrack (webrtc 129)
- gotRemoteMediaTrack (webrtc 129)
- setRemoteMediaDescriptionSuccess (webrtc 159)
- setDescriptionSuccess (webrtc 144)
- getPeerName (webrtc 120)
- XHR finished loading Post - (api.js 46)
- handleConnectionChange<event> (webrtc 183)
- receiveChannelCallback (webrtc 136)
- receiveChannelCallback (webrtc 136)
- Incoming DataChannel push(webrtc 176)
- handleReceiveMessage (webrtc 177)
- Ice state change event (webrtc 182)
- handleConnectionChange (webrtc 183)