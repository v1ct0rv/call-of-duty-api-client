# Call of duty Api Client

## Configuration

You need to set the following environment variables (or create .env file):

*STATS_JOB_INTERVAL: Interval to get stats, this value is in seconds, 20 for example.
*MONGO_DB_URI: Mongo DB url, for example mongodb://root:password@localhost:27017/
*TZ timezone, the recommended value is UTC
*AUTHENTICATION_MODE the auth mode can be `sso` or `username`, `sso` is the recommended option.
*SSO_TOKEN: The SSO token
*USERNAME: The username to be used to authenticate in case of use `username` authentication type.
*PASSWORD:  The password to be used to authenticate in case of use `username` authentication type.
*TWO_CAPTCHA_API_KEY: The 2captcha api key to be used to authenticate in case of use `username` authentication type.

## Setup environment

``` bash
npm install
cd frontend-app
npm install
```

We are using the library [call-of-duty-api](https://github.com/Lierrmm/Node-CallOfDuty), You can find documentation [here](https://lierrmm.gitbook.io/call-of-duty-api/).

The latest version of the package will provide 2 methods of authentication.

1) Puppeteer - you will provide an email and password like before, and the module will use puppeteer to authenticate. This includes solving captchas
Downsides

- Slower than the original method as it has to solve a captcha
- Uses the 2captcha service which is paid. You need to provide the login method with your 2captcha token.

Benefits

- 100% success rate with successful credentials

2) login with SSO - you will provide a SSO token and the old method will be used.

Downsides
- Requires you to pass in a SSO token which expire after 14 days

Benefits
- 100% success rate with valid SSO token
HOW TO RETRIEVE A SSO TOKEN 
step 1. visit https://my.callofduty.com/ and login
step 2. Open dev tools
step 3. navigate to Storage > Cookies and click on https://profile.callofduty.com/
step 4. Look for ACT_SSO_COOKIE and copy the cookie value
step 5. Pass this value into the loginwithSSO method.

You can test on your browser: https://my.callofduty.com/api/papi-client/stats/cod/v1/title/mw/platform/battle/gamer/elmogo06%231516/profile/type/wz

Reminder - the ACT_SSO_COOKIE token expires every 14 days and you will need to repeat the steps to re-validate it
