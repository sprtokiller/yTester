import { Router } from 'express';
import { Request, Response } from 'express';
import { verifyCredentials } from '../auth';
import { ReasonPhrases as PHRASES, StatusCodes as CODE} from 'http-status-codes';
const router = Router();

router.get('/set', function (req : Request, res : Response) {
    req.session.sub = 'Chetan';
    console.log(req.sessionID);
    console.log(req.session.sub);
    res.send('Session set');
  });

  router.get('/get', function (req, res) {
    console.log(req.sessionID);
    console.log(req.session.sub);
    res.send(req.session.sub);
  });

// POST for register
router.post('/login', async function (req : Request, res : Response) {
    const { googleCredential } = req.body;

    await verifyCredentials(googleCredential).then((payload) => {
        console.log(req.sessionID);
        console.log(req.session.sub);
        req.session.email = payload?.email;
        req.session.sub = payload?.sub;
        console.log(req.sessionID);
        console.log(req.session.sub); 
        return res.status(CODE.OK).send(PHRASES.OK);
    }).catch((err) => {
        console.log(err)
        return res.status(CODE.FORBIDDEN).send(PHRASES.FORBIDDEN);
    })
})

module.exports = router;