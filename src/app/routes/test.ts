import { Router } from 'express';
import { Request, Response } from 'express';
import { checkSession } from '../auth';
import { ReasonPhrases as PHRASES, StatusCodes as CODE } from 'http-status-codes';
import { ITestView, ITestDetail } from '../interfaces';
import { Course, Test, AnonymousTester, Module_1, TesterTest, Tester, XRecord, XObject, XVerb } from '../db';
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
    try { //TODO: restrict to only tests that belong to the user
        const test = await Test.findOne({
            where: { testUUID: req.params.testUUID },
            attributes: ['testUUID', 'name', 'courseUUID', 'createdAt', 'startAt', 'endType', 'endAt'],
            include: [
                // { model: Module_1 },
                { model: Course, attributes: ['name'] },
                { model: AnonymousTester, attributes: ['anonymousTesterUUID']},
                { model: Tester, attributes: ['testerUUID', 'firstname', 'lastname', 'email']}
            ]
        });

        if (!test) {
            return res.status(CODE.NOT_FOUND).send(PHRASES.NOT_FOUND);
        }

        // log UUIDs of anonymous testers
        if (test.anonymousTesters) {
            test.anonymousTesters.forEach(t => {
                console.log(t.anonymousTesterUUID);
            })
        }

        if (test.testers) {
            test.testers.forEach(t => {
                console.log(t.testerUUID, t.firstname, t.lastname, t.email);
            })
        }
        
        const testDetail: ITestDetail = {
            testUUID: test.testUUID,
            name: test.name,
            courseUUID: test.courseUUID,
            createdAt: test.createdAt,
            startAt: test.startAt,
            endType: test.endType,
            endAt: test.endAt,
            anonymousTesters: test.anonymousTesters,
            testers: test.testers
        }

        return res.status(CODE.OK).send(testDetail);
    } catch (err) {
        return errorHandle(err, res);
    }
});

// GET for test results
router.get('/result/:testUUID', checkSession, async function (req: Request, res: Response) {
    try {
        // TODO: restrict to only tests that belong to the user
        const records = await XRecord.findAll({
            where: { testUUID: req.params.testUUID },
            //attributes: ['recordUUID', 'testerUUID', 'createdAt'],
            include: [
                { model: XObject, attributes: ['objectID', 'objectType', 'name'] },
                { model: XVerb, attributes: ['verbID', 'display'] }
            ]
        });
        return res.status(CODE.OK).send(records);
    } catch (err) {
        return errorHandle(err, res);
    }
});

// POST for locking test
router.put('/lock/:testUUID', checkSession, async function (req: Request, res: Response) {
    try {
        // TODO: restrict to only tests that belong to the user
        const test = await Test.update({ endAt: new Date() }, { where: { testUUID: req.params.testUUID } });
        return res.status(CODE.OK).send(PHRASES.OK);
    } catch (err) {
        return errorHandle(err, res);
    }
});

// POST for creating test
router.post('/add', checkSession, checkBodyParams(["courseUUID", "name", "endType", "startAt", "endAt", "testerUUIDs"]), async function (req: Request, res: Response) {
    if (req.body.anonymousCount < 0 || req.body.anonymousCount > 1000 || !Number.isInteger(req.body.anonymousCount)) {
        return res.status(CODE.BAD_REQUEST).send('Invalid anonymousCount');
    }

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

        // add Anonymous testers
        let anonymousTesters = [];
        for (let i = 0; i < req.body.anonymousCount; i++) {
            anonymousTesters.push({ testUUID: test.testUUID, anonymousTesterUUID: randomUUID() });
        }
        await AnonymousTester.bulkCreate(anonymousTesters);

        // add testers
        let testers = [];
        for (let i = 0; i < req.body.testerUUIDs.length; i++) {
            testers.push({ testUUID: test.testUUID, testerUUID: req.body.testerUUIDs[i] });
        }
        await TesterTest.bulkCreate(testers);

        return res.status(CODE.CREATED).send(test.testUUID);
    } catch (err) {
        return errorHandle(err, res);
    }
});

module.exports = router;