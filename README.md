# Northcoders News API - By Chris Rule

## Contents

1. [Project Description](#project-description)
2. [Installation](#installation)
3. [Setup](#setup)
4. [Running the Project](#running-the-project)

## Project Description

This project will set out the back end infrastructure for a news style website. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

### Project Links

Front End: https://nc-news-cr.netlify.app/
Front End Beta: https://6308d824069def2d9e33bb70--nc-news-cr.netlify.app/coding
Repo: https://github.com/Chris-Rule/nc-news

Back End: https://cr-nc-news.herokuapp.com/
Repo: https://github.com/Chris-Rule/BE-NC-News

## Installation

This project utilises a PSQL database which is interacted with via node.js (https://node-postgres.com/).

The following technologies have all been installed with node package manager (https://www.npmjs.com/).

Please refer to the package.json file in the root directory for a complete list of dependencies and development dependencies - at the time of writing project dependencies are as follows:

### Technologies

- NODE.JS (https://nodejs.org/en/)(18.1.0)

### Dependencies

- dotenv (https://www.npmjs.com/package/dotenv)(16.0.1)
- express (https://expressjs.com/)(4.18.1)
- pg (https://node-postgres.com/)(8.7.3)
- pg-format (https://www.npmjs.com/package/pg-format)(1.0.4)

### Development Dependencies

- husky (https://typicode.github.io/husky/#/)(8.0.1)
- jest (https://jestjs.io/)(27.5.1)
- jest-extended (https://www.npmjs.com/package/jest-extended)(2.0.0)
- jest-sorted (https://www.npmjs.com/package/jest-sorted)(1.0.14)
- nodemon (https://www.npmjs.com/package/nodemon)(2.0.19)
- supertest (https://www.npmjs.com/package/supertest)(6.2.4)

Note - minimum dependency versions shown as above.

## Setup

### Database Creation

The simplest method for generating the development and test databases is as follows:

in the /db folder generate the following file:

"setup.sql"

For security this file should already be .gitignored.

and populate it with the following where "db" is your database name:

DROP DATABASE IF EXISTS db_test;
DROP DATABASE IF EXISTS db;

CREATE DATABASE db_test;
CREATE DATABASE db;

Then run the following script in the command line:

"npm run setup-dbs"

### Database Access

For security, the names of the databases are .gitignored on this project and so will require setup for the project to be ran on a local machine

The two files are ".env.development" and ".env.test" and will be used by our Dotenv module to load the environment variables contained in these files into process.env (https://www.npmjs.com/package/dotenv).

Each file should contain the following:

PGDATABASE=db

Where "db" is the name of the respective database.

### Database Seeding

There are main script to set up is as follows as is located in the package.json.

npm seed - this by default will populate the development database. The app.test.js file will execute this to populate the test database.

## Running the Project

### Testing

All tests can be ran with the script "npm test" and are located in the //**tests** folder.

### Cloud Hosting

https://devcenter.heroku.com/start
