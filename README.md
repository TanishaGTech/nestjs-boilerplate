**nestjs-boilerplate**


npm command to run without watch - npm run start

npm command to run with watch - npm run start:dev

Mongodb connection -27017(local)

***Concepts included***
#1.Redis#
#2.Swagger#
#3.Jwt authorization and Authentication#
#4.External api calls#
#5.Multer - for file/image uploading#
#6.Routing#
#7.Route gaurds#
#8.dto#
#9.entity#


# Getting started

## Installation

Clone the repository

    git clone https://github.com/TanishaGTech/nestjs-boilerplate.git

Install dependencies
    
    npm install

## Database


- `npm start` - Start application
- `npm run start:watch` - Start application in watch mode
----------
# Authentication
 
This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token. Please check the following sources to learn more about JWT.

----------
 
# Swagger API docs

This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)        