# MaterialSharing-DoubtSolvingPlatform
A MERN Stack based project to solve doubts with the help of a community and also to share good resources with community.
* [Project-Installation-Guide](#project-installation-guide)
# Project-Installation-Guide
- Create a `.env` file at `server/`
- Add the following details correctly,
```
PORT=portNumber

DB_PASS=YourMongodbDatabasePassword
DB_USER=YourMongodbDatabaseUsername

EMAIL_NAME=YourEmail
// The above email will be used to send mail for verification of client and for updates.

EMAIL_PASS=UniquePasswordGeneratedByGoogleForNodemailer
// Go to https://myaccount.google.com/
// There you need to look for Third Party Access Manager
// Add nodemailer as application and Google will auto-generate a password that you'll use here
// Note: this is not your original password. This password is used to identify nodemailer and access your account without using your original password.

DEFAULT_PROFILE_PIC=APublicURLOfPhoto

// Set-up an account at cloudinary and fill below details
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_SECRET_KEY=

JWT_SECRET=AnySecretKeyToGenerateJWTTokens
JWT_EXPIRES_IN=SpecifyTimeInConventionsForExpiryOfTokensGenerated
```
- rum `npm i` at both `server/` and `client/` folders.
- Run `npm start` to start the project in both `server/` and `client/` folder.
