# Notes Sharing and Doubt Solving Platform

Welcome to the Notes Sharing and Discussion Forum project! This is a web-based platform that provides users with the ability to share and discuss notes, as well as engage in conversations with fellow users. This project includes user account management functionalities, such as user registration, login, and password recovery, along with features like post creation, upvoting and downvoting mechanisms, discussion threads, and search functionality.

The project is developed using MERN Stack and is designed to be user-friendly, intuitive, and efficient. This project is aimed at improving user experience and making it easy for users to share and discuss notes in a secure and reliable manner.

We hope that this project will be useful for individuals and groups who are interested in collaborating and sharing knowledge on various topics. Please feel free to explore the code and contribute to the project by submitting pull requests or issues. Thank you for your interest in our project!

## SRS Document

[Document](https://docs.google.com/document/d/1JNK1l1UVuzRfeEsbTi0GyLNAc9kq2Gm5/edit?usp=sharing&ouid=103229390666509090327&rtpof=true&sd=true)

## Demo

Video Link : https://www.youtube.com/watch?v=hrPbWc7mh8o

Website Link : https://harshsojitra007.github.io/CodeStudy/

## Note: If you want to download and run the project on your local machine use below links to download the source code as this repository contains some bugs and might lead the project crash.

#### [Frontend](https://github.com/harshsojitra007/CodeStudy)
#### [Backend](https://github.com/harshsojitra007/Material-Sharing-and-Doubt-Solving-Backend)

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

## Features

1) Note Sharing: Users can create and share notes on various topics.

2) Upvoting and Downvoting: Users can upvote or downvote notes shared by other users.

3) Discussion Threads: Users can start discussion threads on various topics and engage in meaningful conversations with other users.

4) Search Functionality: Users can search for notes, discussion threads, and other content using a search bar.

5) User Profile: Users have their own profiles where they can view their activity history, their posts, and their comments.

Security: The platform is designed with security in mind to ensure that user data is protected.

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> <a href="https://redux.js.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" alt="redux" width="40" height="40"/> </a> </p>



## Authors

- [@DAKSHAY SOLANKI](https://github.com/DAKSHAY111)
- [@HARSH SOJITRA](https://github.com/harshsojitra007)

