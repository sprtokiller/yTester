import { Router } from 'express';
import { Request, Response } from 'express';
import { checkSession } from '../auth';
import { ReasonPhrases as PHRASES, StatusCodes as CODE } from 'http-status-codes';
import { ITestView } from '../interfaces';
import { Course, Test, Module_1 } from '../db';
import { getModules } from '../db/models/Test';
import { checkBodyParams, errorHandle, EndType } from '../utils';
import { randomUUID } from 'crypto';

const router = Router();

// GET for list of all tests
router.get('/list', checkSession, async function (req: Request, res: Response) {

    Course.findAll({
        where: { sub: req.session.sub },
        attributes: [],
        include: [{ model: Test, attributes: ['testUUID', 'name', 'courseUUID', 'createdAt', 'startAt', 'endType', 'endAt'], include: [{ model: Module_1 }] }],
    }).then((courses) => {
        var data: ITestView[] = [];

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
        return errorHandle(err, res);
    })
})

// GET for course detail
router.get('/detail/:testUUID', checkSession, async function (req: Request, res: Response) {
    try {
        const test = await Test.findOne({
            where: { testUUID: req.params.testUUID },
            attributes: ['testUUID', 'name', 'courseUUID', 'createdAt', 'startAt', 'endType', 'endAt'], include: [{ model: Module_1 }, { model: Course, attributes: ['name'] }]
        });

        if (!test) {
            return res.status(CODE.NOT_FOUND).send(PHRASES.NOT_FOUND);
        }
        console.log(test);
        
        const testDetail: ITestView = {
            testUUID: test.testUUID,
            name: test.name,
            courseUUID: test.courseUUID,
            createdAt: test.createdAt,
            startAt: test.startAt,
            endType: test.endType,
            endAt: test.endAt,
            modules: getModules(test)
        }

        return res.status(CODE.OK).send(testDetail);
    } catch (err) {
        return errorHandle(err, res);
    }
});

// POST for creating test
router.post('/add', checkSession, checkBodyParams(["courseUUID", "name", "endType", "startAt", "endAt"]), async function (req: Request, res: Response) {
    try {
        const test = await Test.create({
            testUUID: randomUUID(),
            name: req.body.name.trim(),
            courseUUID: req.body.courseUUID.trim(),
            createdAt: new Date(),
            startAt: new Date(req.body.startAt),
            endType: req.body.endType.trim() === 'MANUAL' ? EndType.MANUAL : EndType.PLAN,
            endAt: req.body.endType.trim() === 'MANUAL' ? null : new Date(req.body.endAt),
        });
        console.log(test);
        return res.status(CODE.CREATED).send(test.testUUID);
    } catch (err) {
        return errorHandle(err, res);
    }
});

module.exports = router;