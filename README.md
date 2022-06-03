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
