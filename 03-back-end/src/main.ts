import * as express from "express";
import * as cors from "cors";
import IConfig from "./common/IConfig.interface";
import { DevConfig } from "./configs";
import * as fs from "fs";
import * as morgan from "morgan";
import IApplicationResources from "./common/IApplicationResources.interface";
import * as mysql2 from "mysql2/promise";
import fileUpload = require("express-fileupload");

async function main() {
  const config: IConfig = DevConfig;

  fs.mkdirSync(config.logging.path, {
    mode: 0o755,
    recursive: true,
  });

  let db = await mysql2.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    charset: config.database.charset,
    timezone: config.database.timezone,
    supportBigNumbers: config.database.supportBigNumbers,
  });

  function attactConnectionMonitoring(db: mysql2.Connection) {
    db.on("error", async (error) => {
      if (!error.fatal) {
        return;
      }

      if (error?.code !== "PROTOCOL_CONNECTION_LOST") {
        throw error;
      }

      console.log("Reconnecting to the database server...");

      db = await mysql2.createConnection(db.config);

      attactConnectionMonitoring(db);

      db.connect();
    });
  }

  attactConnectionMonitoring(db);

  const applicationResources: IApplicationResources = {
    databaseConnection: db,
    services: {},
  };

  const application: express.Application = express();

  application.use(
    morgan(config.logging.format, {
      stream: fs.createWriteStream(
        config.logging.path + "/" + config.logging.filename,
        { flags: "a" }
      ),
    })
  );

  application.use(cors());

  application.use(express.urlencoded({ extended: true }));

  application.use(
    fileUpload({
      limits: {
        files: config.fileUploads.maxFiles,
        fileSize: config.fileUploads.maxFileSize,
      },
      abortOnLimit: true,

      useTempFiles: true,
      tempFileDir: config.fileUploads.temporaryFileDirecotry,
      createParentPath: true,
      safeFileNames: true,
      preserveExtension: true,
    })
  );

  application.use(express.json());

  application.use(
    config.server.static.route,
    express.static(config.server.static.path, {
      index: config.server.static.index,
      dotfiles: config.server.static.dotfiles,
      cacheControl: config.server.static.cacheControl,
      etag: config.server.static.etag,
      maxAge: config.server.static.maxAge,
    })
  );

  for (const router of config.routers) {
    router.setupRoutes(application, applicationResources);
  }

  application.use((req, res) => {
    res.sendStatus(404);
  });

  application.listen(config.server.port);
}

process.on("uncaughtException", (error) => {
  console.error("Error:", error);
});

main();
