# Northcoders News API - By Chris Rule

## Project Description

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

## Installation

This project utilises a PSQL database which is interacted with via node.js (https://node-postgres.com/).

The following technologies have all been installed with node package manager (https://www.npmjs.com/).

Please refer to the package.json file in the root directory for a complete list of dependencies and development dependencies - at the time of writing project dependencies are as follows:

### Dependencies

- dotenv (https://www.npmjs.com/package/dotenv)
- express (https://expressjs.com/)
- pg (https://node-postgres.com/)
- pg-format (https://www.npmjs.com/package/pg-format)

### Development Dependencies

- husky (https://typicode.github.io/husky/#/)
- jest (https://jestjs.io/)
- jest-extended (https://www.npmjs.com/package/jest-extended)
- jest-sorted (https://www.npmjs.com/package/jest-sorted)
- nodemon (https://www.npmjs.com/package/nodemon)
- supertest (https://www.npmjs.com/package/supertest)

## Setup

For security, the names of the databases are .gitignored on this project and so will require setup for the project to be ran on a local machine

The two files are ".env.development" and ".env.test" and will be used by our Dotenv module to load the environment variables contained in these files into process.env (https://www.npmjs.com/package/dotenv).

Each file should contain the following:

PGDATABASE=database_name

## Run the Project

The intent is to have this project executable at four different stages:

Note - previous stages may still be in progress when later stages have been reached.

1 - Unit testing only.
If app.js is not visible in the root project directory then this project is still in setup - refer to **tests** folder.

2 - Integration and unit testing.
If app.js has been produced and placed in the root project directory then integration testing will be taking place alongside unit testing.

3 - Simple back end testing
If a listen.js file has been placed in the root directory and the PORT is manually assigned then the project is at an early stage of usability and API calls can be made on the local machine using an API client like Insomnia (https://insomnia.rest/)

4 - Cloud back end testing with Heroku
If a listen.js file exists in the root directory and the PORT is assigned from the process.env environment object then the project has been deployed to Heroku (https://www.heroku.com/) and API calls should be available online.

## Licensing

FILL THIS OUT
