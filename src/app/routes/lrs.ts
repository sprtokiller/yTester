import { Router } from 'express';
import { Request, Response } from 'express';
import { ReasonPhrases as PHRASES, StatusCodes as CODE } from 'http-status-codes';
import { Test, AnonymousTester, Tester, XVerb, XObject, XRecord } from '../db';
import { checkBodyParams, errorHandle } from '../utils';
import { randomUUID } from 'crypto';

const router = Router();

function isInvalidRequest(body: any) {
    if (
        typeof body.actor !== 'object' ||
        typeof body.verb !== 'object' ||
        typeof body.object !== 'object' ||
        typeof body.actor.id !== 'string' ||
        typeof body.verb.id !== 'string' ||
        typeof body.object.id !== 'string' ||
        typeof body.verb.display !== 'object' ||
        typeof Object.values(body.verb.display)[0] !== 'string' ||
        typeof body.object.objectType !== 'string' ||
        typeof body.object.definition !== 'object' ||
        typeof body.object.definition.name !== 'object' ||
        typeof Object.values(body.object.definition.name)[0] !== 'string'
    ) {
        return true;
    }
    return false;
}

// POST for logging the body
router.post('/:testUUID', checkBodyParams(["actor", "verb", "object"]), async function (req: Request, res: Response) {

    // step 1: check if the body is a valid xAPI statement
    // step 2: check if the testUUID is valid and the tester is in the test
    // step 3: check if the test is accesible
    // step 4: check if the verb exists, if not, create it
    // step 5: check if the object exists, if not, create it
    // step 6: add the statement to the database

    // step 1
    const contentType = req.get('Content-Type');
    if (!contentType || contentType !== 'application/json') {
        return res.status(CODE.BAD_REQUEST).send(PHRASES.BAD_REQUEST);
    }

    // check if the body is a valid xAPI statement
    const body = req.body;

    if (isInvalidRequest(body)) {
        return res.status(CODE.BAD_REQUEST).send(PHRASES.BAD_REQUEST);
    }

    // step 2
    try {
        const test = await Test.findOne({
            where: { testUUID: req.params.testUUID },
            attributes: ['testUUID', 'name', 'courseUUID', 'createdAt', 'startAt', 'endType', 'endAt'],
            include: [
                { model: AnonymousTester, attributes: ['anonymousTesterUUID'] },
                { model: Tester, attributes: ['testerUUID'] }
            ]
        });

        if (!test) {
            return res.status(CODE.NOT_FOUND).send(PHRASES.NOT_FOUND);
        }

        // is the tester in anonymousTester?
        var isIn = false;
        if (test.anonymousTesters) {
            test.anonymousTesters.forEach(tester => {
                if (tester.anonymousTesterUUID === body.actor.id) {
                    isIn = true;
                }
            });
        }
        // is the tester in tester?
        if (test.testers) {
            test.testers.forEach(tester => {
                if (tester.testerUUID === body.actor.id) {
                    isIn = true;
                }
            });
        }

        if (!isIn) {
            return res.status(CODE.NOT_FOUND).send(PHRASES.NOT_FOUND);
        }

        // step 3
        // is startAt valid and in the past?
        if (test.startAt) {
            if (test.startAt.getTime() > Date.now()) {
                return res.status(CODE.FORBIDDEN).send(PHRASES.FORBIDDEN);
            }
        }
        // endAt valid and in the future?
        if (test.endAt) {
            if (test.endAt.getTime() < Date.now()) {
                return res.status(CODE.FORBIDDEN).send(PHRASES.FORBIDDEN);
            }
        }

        // step 4
        await XVerb.findOrCreate({
            where: {
                verbID: body.verb.id
            },
            defaults: {
                verbID: body.verb.id,
                display: Object.values(body.verb.display)[0]
            }
        });

        // step 5
        await XObject.findOrCreate({
            where: {
                objectID: body.object.id
            },
            defaults: {
                objectID: body.object.id,
                objectType: body.object.objectType,
                name: Object.values(body.object.definition.name)[0]
            }
        });

        // step 6
        await XRecord.create({
            recordUUID: randomUUID(),
            testerUUID: body.actor.id,
            verbID: body.verb.id,
            objectID: body.object.id,
            testUUID: req.params.testUUID,
            success: body.result?.success,
            completion: body.result?.completion,
            duration: body.result?.duration,
            response: body.result?.response,
            scoreScaled: body.result?.score?.scaled,
            scoreRaw: body.result?.score?.raw,
            scoreMin: body.result?.score?.min,
            scoreMax: body.result?.score?.max,
            timestamp: body.timestamp ? new Date(body.timestamp) : new Date()
        });


        return res.status(CODE.OK).send(PHRASES.OK);

    } catch (err) {
        return errorHandle(err, res);
    }
})

module.exports = router;