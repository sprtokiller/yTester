import { Router } from 'express';
import { Request, Response } from 'express';
import { checkSession } from '../auth';
import { ReasonPhrases as PHRASES, StatusCodes as CODE} from 'http-status-codes';
import { ITestView } from '../interfaces';
import { Course, Test, Module_1 } from '../db';
import { getModules } from '../db/models/Test';

const router = Router();

// LIST of all tests
router.get('/list', checkSession, async function (req : Request, res : Response) {

    Course.findAll({
        where: { sub: req.session.sub },
        attributes: [],
        include: [{ model: Test, attributes: [ 'testUUID', 'name', 'courseUUID', 'createdAt', 'startAt', 'endType', 'endAt' ], include: [{ model: Module_1 }] }],
    }).then((courses) => {
        var data : ITestView[] = [];

        courses.forEach(course => {
            course.tests.forEach(test => {
                data.push({
                    testUUID: test.testUUID,
                    name: test.name,
                    courseUUID: test.courseUUID,
                    createdAt: test.createdAt,
                    startAt: test.startAt,
                    endType: test.endType,
                    endAt: test.endAt,
                    modules: getModules(test)
                })
            })
        });
        return res.status(CODE.OK).send(data);
    }).catch((err) => {
        console.error(err)
        return res.status(CODE.INTERNAL_SERVER_ERROR).send(PHRASES.INTERNAL_SERVER_ERROR);
    })
})

module.exports = router;