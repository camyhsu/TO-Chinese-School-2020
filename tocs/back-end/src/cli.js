import minimist from "minimist";
import {
  generateChangeLog,
  snapshot,
  sync,
  update,
} from "./services/database.service.js";

const argv = minimist(process.argv.slice(2));
const command = argv._[0];

(() => {
  const fns = {
    "generate-change-log": () => generateChangeLog(argv.diffTypes),
    snapshot: () => snapshot(),
    sync: () => sync(),
    update: () => update(),
  };

  // Check and run command
  if (fns[command]) {
    fns[command]();
  } else {
    console.log("Unrecognized command");
  }
})();
