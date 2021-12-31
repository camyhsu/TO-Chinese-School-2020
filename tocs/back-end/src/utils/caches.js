import Nodecache from "node-cache";

const actionsXRoles = new Nodecache({ stdTTL: 20 });
const anotherCache = new Nodecache();

export { actionsXRoles, anotherCache };
