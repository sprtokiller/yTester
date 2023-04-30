import { Router } from 'express';
import { Request, Response } from 'express';
import { verifyCredentials } from '../auth';
import { ReasonPhrases as PHRASES, StatusCodes as CODE} from 'http-status-codes';

import { User } from '../db'
import { errorHandle } from '../utils';

const router = Router();

// POST for login (register on first time)
router.post('/login', async function (req : Request, res : Response) {
    const { googleCredential } = req.body;
    verifyCredentials(googleCredential).then((payload) => {
        // find user in database
        User.findOrCreate({ where: { sub: payload?.sub }, defaults: { email: payload?.email } }).then((user) => {
            // set session
            req.session.email = payload?.email;
            req.session.sub = payload?.sub;
            return res.status(CODE.OK).send(PHRASES.OK);
        }).catch((err) => {
            console.log(err)
            return res.status(CODE.FORBIDDEN).send(PHRASES.FORBIDDEN);
        })
    }).catch((err) => {
        console.log(err)
        return res.status(CODE.FORBIDDEN).send(PHRASES.FORBIDDEN);
    })
})

// POST for logout
router.post('/logout', async function (req : Request, res : Response) {
    console.log(req.session.sub);
    req.session.destroy((err) => {
        if (err) {
            return errorHandle(err, res);
        }
    })

    return res.status(CODE.OK).send(PHRASES.OK);
})

// GET for checking if user is logged in
router.get('/check', async function (req : Request, res : Response) {
    console.log(req.session.sub);
    if (req.session.sub) {
        return res.status(CODE.OK).send(PHRASES.OK);
    } else {
        return res.status(CODE.UNAUTHORIZED).send(PHRASES.UNAUTHORIZED);
    }
})

module.exports = router;