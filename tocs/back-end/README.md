# TOCS registration app back-end

The Node.js back-end application for student information and registration used by Thousand Oaks Chinese School.

## Development Notes

### Prettier code formatter

This codebase has been formatted by [Prettier](https://www.npmjs.com/package/prettier).
Please make sure that any code changes / additions are also formatted by
Prettier before committing to the git repository. Prettier are installed
when `npm install` is executed for the project. With Prettier installed,
use

```shell
npx prettier --check .
```

at the root directory of the package to check the format. If formatting
is needed, use

```shell
npx prettier --write .
```

at the root directory of the package to format the code.

Please be aware that the Prettier version is fixed in package.json per
recommendation. Different versions of Prettier may format code
differently, so the version should not be changed by a simple
`npm upgrade`

### Installing NPM packages

```
npm install
```

### PostgreSQL Database Setup

#### Development environment

##### Create a user and database

```
CREATE USER tocsorg_camyhsu WITH PASSWORD '1234';
CREATE DATABASE chineseschool_development OWNER tocsorg_camyhsu;
```

#### Test environment

##### Create a user and database

```
CREATE USER test_user WITH PASSWORD '1234';
CREATE DATABASE test_db OWNER test_user;
```

### Development Server

Simply use the following command to start the development server. The server will reload files as they changes.

```
npm start
```

### Running API integration tests

Before running the API integration tests, start the test server with:

```
npm run start-test-api-server
```

Then execute the full API integration test suite with:

```
npm run test-api
```

### CLI

#### Commands

##### update

Run `update` to create/update database schema.
Read schema from `schema/dbchangelog.xml`.

```
./cli update
```

##### snapshot

Run `snapshot` to capture the current state of the database.
Output to `output/db-snapshot.yaml`

```
./cli snapshot
```

##### sync

Run `sync` to marks all undeployed changes in `schema/dbchangelog.xml` as executed in your database.

```
./cli sync
```

##### generate-change-log

Run `generate-change-log` to create a changelog file that has a sequence of changesets which describe how to re-create the current schema of the database (without data).

Output to `output/dbchangelog-*.xml`

Use following options for different types:

`--diffTypes`: catalog,tables,functions,views,columns,indexes,foreignkeys,primarykeys,uniqueconstraints,data,storedprocedure,triggers,sequences

```
./cli generate-change-log
./cli generate-change-log --diffTypes data
```
