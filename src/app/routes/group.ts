import { Router } from 'express';
import { Request, Response } from 'express';
import { checkSession } from '../auth';
import { ReasonPhrases as PHRASES, StatusCodes as CODE } from 'http-status-codes';
import { IGroupView } from '../interfaces';
import { Tester, AnonymousTester, Group } from '../db';
import { getModules } from '../db/models/Test';
import { checkBodyParams, errorHandle, EndType } from '../utils';
import { randomUUID } from 'crypto';
import { fn, col } from 'sequelize';

const router = Router();

// [C] POST for creating new tester group
router.post('/add', checkSession, async function (req: Request, res: Response) {
  try {
    const group = await Group.create({
      groupUUID: randomUUID(),
      groupName: req.body.groupName,
      sub: req.session.sub
    });

    // create and add anonymous testers
    if (req.body.groupAnonymousCount && req.body.groupAnonymousCount > 0 && req.body.groupAnonymousCount <= 1000) {
      let anonymousTesters = [];
      for (let i = 0; i < req.body.groupAnonymousCount; i++) {
        anonymousTesters.push({
          anonymousTesterUUID: randomUUID(),
          groupUUID: group.groupUUID
        });
      }
      await AnonymousTester.bulkCreate(anonymousTesters);
    }

    return res.status(CODE.CREATED).send(group.groupUUID);
  } catch (err) {
    return errorHandle(err, res);
  } 
});


// [D] DELETE for deleting tester and all its tester groups
router.delete('/delete/:groupUUID', checkSession, async function (req: Request, res: Response) {
  try {
    // delete one course
    const group = await Group.findOne({
      where: { groupUUID: req.params.groupUUID, sub: req.session.sub },
    });
    if (!group) {
      return res.status(CODE.NOT_FOUND).send(PHRASES.NOT_FOUND);
    }

    await group.destroy();

    return res.status(CODE.OK).send(PHRASES.OK);
  } catch (err) {
    return errorHandle(err, res);
  }
});

// [L] GET for list of all groups
router.get('/list', checkSession, async function (req: Request, res: Response) {
  Group.findAll({
    where: { sub: req.session.sub },
    attributes: ['groupUUID', 'groupName'],
    include: [
      { model: Tester, attributes: ['testerUUID'] },
      { model: AnonymousTester, attributes: ['anonymousTesterUUID'] }
    ],
  }).then((groups) => {
    var shortGroups : IGroupView[] = [];
    
    groups.forEach(group => {
      shortGroups.push({
        groupUUID : group.groupUUID,
        groupName : group.groupName,
        groupAnonymousCount : group.anonymousTesters?.length ?? 0,
        groupTestersCount : group.testers?.length ?? 0
      })
    });

    return res.status(CODE.OK).send(shortGroups);
  }).catch((err) => {
    return errorHandle(err, res);
  })
})

module.exports = router;