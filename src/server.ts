import express, { Request, Response, NextFunction } from 'express';
import dbInit from './app/db/init';
import verifyCredentials from './app/auth';

const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:7331"
};

function formatDate(date : Date) {
    const padTwo = (val : number) => (val > 9 ? "" : "0") + val;
    const year = date.getFullYear()
    const month = padTwo((date.getMonth() + 1))
    const day = padTwo((date.getDate()))
    const hours = padTwo((date.getHours()))
    const minutes = padTwo((date.getMinutes()))
    const seconds = padTwo((date.getSeconds()))
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

function logRequests(req : Request, res : Response, next : NextFunction) {
    console.log(`[${formatDate(new Date())}] ${req.method} ${req.url}`);
    next();
  }

async function main() {
  // create initial data
  await dbInit();

  // await verifyCredentials('eyJhbGciOiJSUzI1NiIsImtpZCI6ImM5YWZkYTM2ODJlYmYwOWViMzA1NWMxYzRiZDM5Yjc1MWZiZjgxOTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2ODI1MjMyMjEsImF1ZCI6Ijc3Mzc1MDA2MjAxOC1yNzFvb3U1ZXBqOTUzYzZ0bm45YWp1ODRyMTJmczJrYy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwOTI5NzM1ODAxMjk5MTgwNDM5NCIsImVtYWlsIjoidml0ZXpzbGF2a3JpejI0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiI3NzM3NTAwNjIwMTgtcjcxb291NWVwajk1M2M2dG5uOWFqdTg0cjEyZnMya2MuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJuYW1lIjoiVsOtdMSbenNsYXYgS8WZw63FviIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BR05teXhhSDlkVFFpQ3FkY2JabGJSN0JPRmlUSkkydllCTy1qYmVNUWk5Tz1zOTYtYyIsImdpdmVuX25hbWUiOiJWw610xJt6c2xhdiIsImZhbWlseV9uYW1lIjoiS8WZw63FviIsImlhdCI6MTY4MjUyMzUyMSwiZXhwIjoxNjgyNTI3MTIxLCJqdGkiOiJlMWRjMGY1NzQ3NGE2ZDg4ZjQ2ODVmZGI2N2Q3Nzk5YmVlYmYwODU5In0.ZbGXxevmB18hGmIIZdF0SGvn95eZWRdW4r67fQ_xrIh57w2DlXylOJTI0G1w_GpMrZ17METXHOdf4Pf-Fep6Fgs-FzjTmWZfMgnnhOi375013YBaYHH7VfXOKaVwCS_NM57obI7jIzd84-tmFAoNjJJCh9k2-ufbd7T_ZWWnbM5jlkGEz4_VKTNqLHkgJ127n2Vy8wSfzQGai1F2KJsxI9e3BP2SjeGOG_TKp_nnNQ-ciMBMQpGvUwvhWiB7HRlZnxVorVsYv3LPq58yvql2H0GQCh0DxFhaz5Ga_dm2JrIEwPFL6xLmp4IAnuQhJi8b9SvFA5bNqKDY54OXE0xdFA').then((userInfo) => {
  //   console.log(userInfo)
  //   // use userInfo and do your server-side logics here
  // }).catch((error) => {
  //   console.error(error)
  //   // validation failed and userinfo was not obtained
  // });

  app.use(cors(corsOptions));
  // parse requests of content-type - application/json
  app.use(bodyParser.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(logRequests);

  ///app.use('/', routes);
  ///app.use(express.static('dist', { index: 'index.html' }))
  app.all('*', function (req : Request, res : Response, next : NextFunction) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
  });

  // simple route TODO: remove
  app.get("/", (req : Request, res : Response) => {
      res.json({ message: `Welcome to ts node! ${formatDate(new Date())}` });
  });

  // set port, listen for requests
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

main();