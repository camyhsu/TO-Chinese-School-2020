# Thousand Oaks Chinese School Application

## Quick start guide for local `Develop` environment
### 0. Tool versions
```
$ psql --version
psql (PostgreSQL) 13.1

$ node -v
v15.8.0
```
### 1. PostgreSQL Database setup

Follow instructions in `back-end/README.md`

* PostgreSQL Database Setup > Develop environment

**Note:** Database should have no relations at this point.
```
$ psql -Utocsorg_camyhsu -d chineseschool_development
chineseschool_development=> \d
```

### 2. Install back-end
```
$ cd back-end
$ npm install
```

### 3. Create database schema
```
$ cd back-end
$ ./cli update
```
**Note:** Tables should be created at this point.
```
$ psql -Utocsorg_camyhsu -d chineseschool_development
chineseschool_development=> \d
```

### 4. Start back-end API server
```
$ cd back-end
$ npm start
```

### 5. Install front-end
```
$ cd front-end
$ npm install
```

### 6. Start front-end UI server
```
$ cd front-end
$ npm start
```

### 7. Connect to website using browser and register new account
`http://localhost:3000/`
