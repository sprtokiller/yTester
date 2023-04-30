import { Router } from 'express';
import { Request, Response } from 'express';
import { checkSession } from '../auth';
import { ReasonPhrases as PHRASES, StatusCodes as CODE } from 'http-status-codes';
import { checkBodyParams } from '../utils';
import { Test, Course, Module_1 } from '../db';
import { getModules } from '../db/models/Test';
import { ICourseDetail } from '../interfaces';

const router = Router();

// GET for list of courses
router.get('/list', checkSession, async function (req: Request, res: Response) {
    Course.findAll({
        where: { sub: req.session.sub },
        attributes: ['courseUUID', 'name', 'author', 'version', 'groupHash'],
        include: [{ model: Test, attributes: ['startAt', 'endAt'] }],
    }).then((courses) => {
        return res.status(CODE.OK).send(courses);
    }).catch((err) => {
        console.error(err)
        return res.status(CODE.INTERNAL_SERVER_ERROR).send(PHRASES.INTERNAL_SERVER_ERROR);
    })
})

// GET for course detail
router.get('/detail/:courseUUID', checkSession, async function (req: Request, res: Response) {
    try {
        const course = await Course.findOne({
            where: { courseUUID: req.params.courseUUID, sub: req.session.sub },
            attributes: ['courseUUID', 'name', 'author', 'version', 'groupHash', 'courseHash'],
            include: [{
                model: Test,
                attributes: ['testUUID', 'name', 'courseUUID', 'createdAt', 'startAt', 'endType', 'endAt'],
                include: [{ model: Module_1 }]
            }],
        });
        if (!course) {
            return res.status(CODE.NOT_FOUND).send(PHRASES.NOT_FOUND);
        }

        const courseDetail: ICourseDetail = {
            courseUUID: course.courseUUID,
            name: course.name,
            author: course.author,
            version: course.version,
            groupHash: course.groupHash,
            courseHash: course.courseHash,
            tests: []
        }

        course.tests.forEach(test => {
            courseDetail.tests?.push({
                testUUID: test.testUUID,
                name: test.name,
                courseUUID: test.courseUUID,
                createdAt: test.createdAt,
                startAt: test.startAt,
                endType: test.endType,
                endAt: test.endAt,
                modules: getModules(test)
            });
        });

        const otherVersions = await Course.findAll({
            where: { groupHash: course.groupHash, sub: req.session.sub },
            attributes: ['courseUUID', 'name', 'author', 'version', 'groupHash'],
        });

        courseDetail.otherVersions = otherVersions
            .filter(course => course.courseUUID !== courseDetail.courseUUID)
            .map(({ courseUUID, name, author, version, groupHash }) => ({
                courseUUID,
                name,
                author,
                version,
                groupHash
            }));

        console.log(courseDetail);
        return res.status(CODE.OK).send(courseDetail);
    } catch (err) {
        console.error(err);
        return res.status(CODE.INTERNAL_SERVER_ERROR).send(PHRASES.INTERNAL_SERVER_ERROR);
    }
});

// POST for renaming course
router.post('/rename/:courseUUID', checkSession, checkBodyParams(["courseName"]), async function (req: Request, res: Response) {
    try {
        // update one course
        const course = await Course.findOne({
            where: { courseUUID: req.params.courseUUID, sub: req.session.sub },
            attributes: ['courseUUID', 'name', 'author', 'version', 'groupHash', 'courseHash'],
        });
        if (!course) {
            return res.status(CODE.NOT_FOUND).send(PHRASES.NOT_FOUND);
        }

        course.name = req.body.courseName.trim();
        await course.save();

        return res.status(CODE.OK).send(PHRASES.OK);
    } catch (err) {
        console.error(err);
        return res.status(CODE.INTERNAL_SERVER_ERROR).send(PHRASES.INTERNAL_SERVER_ERROR);
    }
});



module.exports = router;
