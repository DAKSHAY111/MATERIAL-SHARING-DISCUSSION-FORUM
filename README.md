
# Notes Sharing and Doubt Solving Platform

Welcome to the Notes Sharing and Discussion Forum project! This is a web-based platform that provides users with the ability to share and discuss notes, as well as engage in conversations with fellow users. This project includes user account management functionalities, such as user registration, login, and password recovery, along with features like post creation, upvoting and downvoting mechanisms, discussion threads, and search functionality.

The project is developed using MERN Stack and is designed to be user-friendly, intuitive, and efficient. This project is aimed at improving user experience and making it easy for users to share and discuss notes in a secure and reliable manner.

We hope that this project will be useful for individuals and groups who are interested in collaborating and sharing knowledge on various topics. Please feel free to explore the code and contribute to the project by submitting pull requests or issues. Thank you for your interest in our project!


## Demo

Video Link : https://www.youtube.com/watch?v=hrPbWc7mh8o

## Installation Guide

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
