/* eslint-disable no-unused-vars */
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import config from "config";
import routes from "./api/routes/index.js";
import { logger } from "./utils/logger.js";
import { authJwt, rolePermission } from "./api/middleware/index.js";

const createRouters = (n) =>
  [...Array(n || 1).keys()].map(() => express.Router());
const [publicRouter, apiRouter, rolePermissionRouter] = createRouters(3);

apiRouter.use(authJwt.verifyToken);
// Log
apiRouter.use((req, _res, next) => {
  const { userId, method, originalUrl, params, query } = req;
  // eslint-disable-next-line max-len
  logger.info(
    `userId=${userId} method=${method} url=${originalUrl} params=${JSON.stringify(
      params
    )} query=${JSON.stringify(query)}`
  );
  next();
});

rolePermissionRouter.use(rolePermission.isActionPermitted);

// Port to listen for requests
const PORT = process.env.PORT || 3001;
const corsOptions = { origin: config.get("corsOrigin") };

const app = express();

app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Routers
app.use("/", publicRouter);
app.use("/api", apiRouter);
app.use("/api", rolePermissionRouter);

// Routes
routes.authRoutes(publicRouter);
routes.userRoutes(apiRouter);
routes.accountingRoutes(rolePermissionRouter);
routes.communicationRoutes(rolePermissionRouter);
routes.instructionRoutes(rolePermissionRouter);
routes.librarianRoutes(rolePermissionRouter);
routes.registrationRoutes(rolePermissionRouter);
routes.studentRoutes(rolePermissionRouter);

// Common response header
app.use((_req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use((obj, _req, res, _next) => {
  const { status, message, rtnObj } = obj;

  if (obj instanceof Error) {
    logger.error(`Caught ${JSON.stringify(obj)}`);
    res
      .status(status || 500)
      .send({ message: message || "Internal Server Error" });
    return;
  }
  res.status(status).send(rtnObj);
});

app.listen(PORT, () =>
  logger.info(
    `Server is running. port=${PORT} environment=${process.env.NODE_ENV}`
  )
);
