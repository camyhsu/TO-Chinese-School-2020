import fs from 'fs';
import liquibase from 'liquibase';
import config from 'config';

const dbConfig = config.get('dbConfig');
const DIR = './output';
const changeLogFile = 'schema/dbchangelog.xml';
const logFile = `${DIR}/db-log.log`;
const snapshotOutputFile = `${DIR}/db-snapshot.yaml`;
const createOutputDir = () => !fs.existsSync(DIR) && fs.mkdirSync(DIR);

const commonLiquibaseConfig = {
  url: `jdbc:postgresql://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`,
  classpath: 'drivers/postgresql-42.2.18.jar',
  username: dbConfig.username,
  password: dbConfig.password,
  logLevel: 'debug',
  logFile,
};

const runLiquibase = (cmd, cfg) => {
  // Check environment
  if (!dbConfig) {
    throw new Error('Unrecognized environment');
  }

  createOutputDir();

  return liquibase({ ...cfg, ...commonLiquibaseConfig })
    .run(cmd)
    .then((r) => r)
    .catch((err) => console.error('fail', err));
};

const databaseName = dbConfig.database;
const generateChangeLog = (diffTypes) => runLiquibase('generateChangeLog', { changeLogFile: `${DIR}/dbchangelog-${Date.now()}.xml`, ...(diffTypes && { diffTypes }) });
const snapshot = () => runLiquibase('snapshot', { overwriteOutputFile: 'true', outputFile: snapshotOutputFile });
const sync = () => runLiquibase('changelogSync', { changeLogFile });
const update = () => runLiquibase('update', { changeLogFile });

export {
  databaseName,
  generateChangeLog,
  snapshot,
  sync,
  update,
};
