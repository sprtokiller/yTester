import { Router } from 'express';
import { Request, Response } from 'express';
import { checkSession } from '../auth';
import { ReasonPhrases as PHRASES, StatusCodes as CODE } from 'http-status-codes';
import { ITestView, ITester } from '../interfaces';
import { Tester, TesterGroup, Group } from '../db';
import { getModules } from '../db/models/Test';
import { checkBodyParams, errorHandle, EndType } from '../utils';
import { randomUUID } from 'crypto';

const router = Router();

// Preview POST for getting a list of testers specified by testerUUIDs and groupUUIDs
router.post('/preview', checkSession, async function (req: Request, res: Response) {
  try {
    const testerUUIDs: string[] = req.body.testerUUIDs;
    const groupUUIDs: string[] = req.body.groupUUIDs;

    // get all testers
    const testers = await Tester.findAll({
      where: {
        testerUUID: testerUUIDs,
        sub: req.session.sub
      },
      attributes: ['testerUUID', 'firstname', 'lastname', 'email']
    });

    // get all testers in groups
    const groupTesters = await Group.findAll({
      where: {
        groupUUID: groupUUIDs,
        sub: req.session.sub
      },
      attributes: ['groupUUID'],
      include: [
        { model: Tester, attributes: ['testerUUID', 'firstname', 'lastname', 'email'] },
      ],
    });
    
    // combine the two lists through set union
    let allTesterUUIDsSet = new Set();
    let allTesters: ITester[] = [];
    for (let tester of testers) {
      allTesterUUIDsSet.add(tester.testerUUID);
      allTesters.push({
        testerUUID: tester.testerUUID,
        firstname: tester.firstname,
        lastname: tester.lastname,
        email: tester.email,
      });
    }

    for (let group of groupTesters) {
      if (!group.testers) {
        continue;
      }
      for (let tester of group.testers) {
        if (allTesterUUIDsSet.has(tester.testerUUID)) {
          continue;
        }
        allTesterUUIDsSet.add(tester.testerUUID);
        allTesters.push({
          testerUUID: tester.testerUUID,
          firstname: tester.firstname,
          lastname: tester.lastname,
          email: tester.email,
        });
      }
    }

    return res.status(CODE.OK).send(allTesters);
  } catch (err) {
    return errorHandle(err, res);
  }
});

// [C] POST for creating new tester
router.post('/add', checkSession, async function (req: Request, res: Response) {
  try {
    const tester = await Tester.create({
      testerUUID: randomUUID(),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      sub: req.session.sub
    });

    return res.status(CODE.CREATED).send(tester.testerUUID);
  } catch (err) {
    return errorHandle(err, res);
  } 
});


// [D] DELETE for deleting tester and all its tester groups
router.delete('/delete/:testerUUID', checkSession, async function (req: Request, res: Response) {
  try {
    // delete one course
    const tester = await Tester.findOne({
      where: { testerUUID: req.params.testerUUID, sub: req.session.sub },
    });
    if (!tester) {
      return res.status(CODE.NOT_FOUND).send(PHRASES.NOT_FOUND);
    }

    await tester.destroy();

    return res.status(CODE.OK).send(PHRASES.OK);
  } catch (err) {
    return errorHandle(err, res);
  }
});

// [L] GET for list of all testers
router.get('/list', checkSession, async function (req: Request, res: Response) {

  Tester.findAll({
    where: { sub: req.session.sub },
    attributes: ['testerUUID', 'firstname', 'lastname', 'email']
  }).then((testers) => {
    return res.status(CODE.OK).send(testers);
  }).catch((err) => {
    return errorHandle(err, res);
  })
})

module.exports = router;