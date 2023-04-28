import { Router } from 'express';
import { Request, Response } from 'express';
import { verifyCredentials } from '../auth';
import { Sequelize } from 'sequelize-typescript'
import { ReasonPhrases as PHRASES, StatusCodes as CODE} from 'http-status-codes';

import { Test } from '../db/models/Test'
import { Course } from '../db/models/Course'
import { ICourseView } from '../interfaces';

const router = Router();

// GET for checking if user is logged in
router.get('/list', async function (req : Request, res : Response) {
    if (req.session.sub) {
        Course.findAll({
            where: { sub: req.session.sub },
            attributes: ['courseUUID', 'name', 'author', 'version', 'groupHash'],
            include: [{ model: Test, attributes: [ 'startAt', 'endAt' ]}],
        }).then((courses) => {
            return res.status(CODE.OK).send(courses);
        }).catch((err) => {
            console.error(err)
            return res.status(CODE.INTERNAL_SERVER_ERROR).send(PHRASES.INTERNAL_SERVER_ERROR);
        })
    } else {
        return res.status(CODE.UNAUTHORIZED).send(PHRASES.UNAUTHORIZED);
    }
})

module.exports = router;