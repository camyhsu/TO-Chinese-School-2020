# back-end

A Node.js back-end application code used by Thousand Oaks Chinese School.

## Install
```
npm install
```

## PostgreSQL Database Setup
### Develop environment
#### Create a user and database
```
CREATE USER tocsorg_camyhsu WITH PASSWORD '1234';
CREATE DATABASE chineseschool_development OWNER tocsorg_camyhsu;
```
### Test environment
#### Create a user and database
```
CREATE USER test_user WITH PASSWORD '1234';
CREATE DATABASE test_db OWNER test_user;
```

## API Server
```
npm start
```

## CLI
### Commands

#### update
Run `update` to create/update database schema.
Read schema from `schema/dbchangelog.xml`.
```
./cli update
```

#### snapshot
Run `snapshot` to capture the current state of the database.
Output to `output/db-snapshot.yaml`
```
./cli snapshot
```

#### sync
Run `sync` to marks all undeployed changes in `schema/dbchangelog.xml` as executed in your database.
```
./cli sync
```

#### generate-change-log
Run `generate-change-log` to create a changelog file that has a sequence of changesets which describe how to re-create the current schema of the database (without data).

Output to `output/dbchangelog-*.xml`

Use following options for different types:

`--diffTypes`: catalog,tables,functions,views,columns,indexes,foreignkeys,primarykeys,uniqueconstraints,data,storedprocedure,triggers,sequences
```
./cli generate-change-log
./cli generate-change-log --diffTypes data
```