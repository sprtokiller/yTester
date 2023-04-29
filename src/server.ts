import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dbInit from './app/db/init';
import { logRequests } from './app/utils';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const routesDir = path.join(__dirname, './app/routes');
const routeFiles = fs.readdirSync(routesDir);

declare module 'express-session' {
  interface SessionData {
    email?: string;
    sub?: string;
  }
}

const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:1337",
  credentials: true
};

async function main() {
  // create initial data
  await dbInit();

  // cookie parser
  app.use(cookieParser());

  // session
  app.use(session({
    secret: process.env.SESSION_KEY || 'secret',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
  }));

  // CORS
  app.use(cors(corsOptions));

  // parse requests of content-type - application/json
  app.use(bodyParser.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(logRequests);

  // all routes start with /api
  routeFiles.forEach(file => {
    const filePath = path.join(routesDir, file);
    const routeHandler = require(filePath);
    const routePath = `/api/${file.split('.')[0]}`;
    app.use(routePath, routeHandler);
  });

  ///app.use('/', routes);
  ///app.use(express.static('dist', { index: 'index.html' }))
  app.all('*', function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  // simple route TODO: remove
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: `Welcome to ts node!` });
  });

  // set port, listen for requests
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

main();