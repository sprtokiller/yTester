import { Router } from 'express';
import { Request, Response } from 'express';
import { checkSession } from '../auth';
import { ReasonPhrases as PHRASES, StatusCodes as CODE } from 'http-status-codes';
import { checkBodyParams, errorHandle } from '../utils';
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
        return errorHandle(err, res);
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

        return res.status(CODE.OK).send(courseDetail);
    } catch (err) {
        return errorHandle(err, res);
    }
});

// PUT for renaming course
router.put('/rename/:courseUUID', checkSession, checkBodyParams(["courseName"]), async function (req: Request, res: Response) {
    try {
        // update one course
        const course = await Course.findOne({
            where: { courseUUID: req.params.courseUUID, sub: req.session.sub },
        });
        if (!course) {
            return res.status(CODE.NOT_FOUND).send(PHRASES.NOT_FOUND);
        }

        course.name = req.body.courseName.trim();
        await course.save();

        return res.status(CODE.OK).send(PHRASES.OK);
    } catch (err) {
        return errorHandle(err, res);
    }
});

// DELETE for deleting course and all its tests
router.delete('/delete/:courseUUID', checkSession, async function (req: Request, res: Response) {
    try {
        // delete one course
        const course = await Course.findOne({
            where: { courseUUID: req.params.courseUUID, sub: req.session.sub },
        });
        if (!course) {
            return res.status(CODE.NOT_FOUND).send(PHRASES.NOT_FOUND);
        }

        await course.destroy();

        return res.status(CODE.OK).send(PHRASES.OK);
    } catch (err) {
        return errorHandle(err, res);
    }
});

// GET route for checking if course name is unique
router.get('/check/:groupHash/:courseHash', checkSession, async function (req: Request, res: Response) {
    try {
        console.log(req.params.groupHash, req.params.courseHash, req.session.sub);
        const course = await Course.findOne({
            where: { groupHash: req.params.groupHash, courseHash: req.params.courseHash, sub: req.session.sub },
        });
        
        if (!course) {
            return res.status(CODE.OK).send(null);
        }
        return res.status(CODE.OK).send(course.courseUUID);
        
    } catch (err) {
        return errorHandle(err, res);
    }
});

module.exports = router;

