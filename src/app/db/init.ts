import { Course } from './models/Course'
import { User } from './models/User'
import { Test } from './models/Test'
import { Module_1 } from './models/Module_1'

import { Tester } from './models/Tester'
import { Group } from './models/Group'
import { TesterGroup } from './models/TesterGroup'
import { AnonymousTester } from './models/AnonymousTester'

import sql from './config';
import { Month, EndType, ContentType } from '../utils';
import { randomUUID } from 'crypto'

const dbInit = async () => {
  // reset database
  await sql.sync({ force: true });

  // create users
  await User.bulkCreate([
    {
      sub: '109297358012991804394',
      email: 'vitezslavkriz24@gmail.com'
    }
  ], { validate: true })

  // create courses
  await Course.bulkCreate([
    {
      courseUUID: '98f3ee48-7593-4504-9d48-3ace56f96c93',
      name: 'xAPI_simple',
      author: 'Vítězslav Kříž',
      version: 5,
      groupHash: 'da41b34d-fbd7-4428-a4b5-7028cd401bdb',
      courseLocation: 'items/x76CxTXo7UHsz92k/story.html',
      contentType: ContentType.STORYLINE,
      sub: '109297358012991804394'
    },
    {
      courseUUID: '5e06909d-12ff-4c50-a460-c28d9eca69b7',
      name: 'xAPI_simple',
      author: 'Vítězslav Kříž',
      version: 7,
      groupHash: 'da41b34d-fbd7-4428-a4b5-7028cd401bdb',
      courseLocation: 'items/bxR_bN7eF90WPICq/story.html',
      contentType: ContentType.STORYLINE,
      sub: '109297358012991804394'
    },
    {
      courseUUID: 'cd2654ab-be0e-4bdb-b4b3-41c968354291',
      name: 'Tvorba WWW stránek 1',
      author: 'Kateřina Chromčáková',
      version: 8,
      groupHash: 'd9fb6a33-e073-4603-aa7e-4c16b4b3b759',
      courseLocation: 'items/1cyFXEPcCxqzyOzf/story.html',
      contentType: ContentType.STORYLINE,
      sub: '109297358012991804394'
    }
  ], { validate: true })

  // create tests
  await Test.bulkCreate([
    {
      testUUID: 'cfcd95eb-4c13-4432-9a96-1892b4268b97',
      name: 'Test 01 of \'Tvorba WWW stránek 1\' (version 8)',
      courseUUID: 'cd2654ab-be0e-4bdb-b4b3-41c968354291',
      // start in past and MANUAL end -> 'Active'
      createdAt: new Date(2023, Month.March, 16, 10, 45, 16),
      startAt: new Date(2023, Month.March, 18, 8, 0, 0),
      endType: EndType.MANUAL,
    },
    {
      testUUID: '76ec0911-7a99-43a0-9d9c-ae3aa38180fc',
      name: 'Test 02 of \'Tvorba WWW stránek 1\' (version 8)',
      courseUUID: 'cd2654ab-be0e-4bdb-b4b3-41c968354291',
      // started and end in future -> 'Active'
      createdAt: new Date(2023, Month.March, 16, 10, 51, 18),
      startAt: new Date(2023, Month.March, 18, 8, 0, 0),
      endType: EndType.PLAN,
      endAt: new Date(2025, Month.March, 18, 8, 0, 0),
    },
    {
      testUUID: '51e60bef-24d7-48a2-9e27-4e3f7e6c9fff',
      name: 'Test 03 of \'Tvorba WWW stránek 1\' (version 8)',
      courseUUID: 'cd2654ab-be0e-4bdb-b4b3-41c968354291',
      // start in future and MANUAL/future end -> 'Planned'
      createdAt: new Date(2023, Month.March, 17, 12, 13, 2),
      startAt: new Date(2024, Month.March, 18, 8, 0, 0),
      endType: EndType.MANUAL,
    },
    {
      testUUID: '018244af-c099-43e0-9be6-0eb928fb12d6',
      name: 'Můj pojmenovaný test \'xAPI_simple\' AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      courseUUID: '5e06909d-12ff-4c50-a460-c28d9eca69b7',
      // start in past and end in past -> 'Finished'
      createdAt: new Date(2023, Month.April, 9, 12, 13, 2),
      startAt: new Date(2023, Month.April, 10, 8, 0, 0),
      endType: EndType.PLAN,
      endAt: new Date(2023, Month.April, 14, 23, 59, 59),
    },
    {
      testUUID: 'dcc0c679-3ae1-473a-a042-b7c72fb9b553',
      name: 'Test 02 of \'xAPI_simple\' (version 7)',
      courseUUID: '5e06909d-12ff-4c50-a460-c28d9eca69b7',
      // start in past and end in past -> 'Finished'
      createdAt: new Date(2023, Month.April, 9, 12, 13, 2),
      startAt: new Date(2023, Month.April, 10, 8, 0, 0),
      endType: EndType.MANUAL,
      endAt: new Date(2023, Month.April, 12, 11, 38, 55),
    },
    {
      testUUID: '3a8fccb1-9113-43f4-b410-e10eb947e33a',
      name: 'WIP test of \'xAPI_simple\' (version 7)',
      courseUUID: '5e06909d-12ff-4c50-a460-c28d9eca69b7',
      // no start -> 'WIP' (no chip)
      createdAt: new Date(2023, Month.April, 14, 12, 13, 2),
    }
  ], { validate: true })

  // create modules 1 for some tests
  await Module_1.bulkCreate([
    {
      moduleUUID: 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
      testUUID: 'cfcd95eb-4c13-4432-9a96-1892b4268b97'
    },
    {
      moduleUUID: 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4e',
      testUUID: '76ec0911-7a99-43a0-9d9c-ae3aa38180fc'
    },
    {
      moduleUUID: 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4f',
      testUUID: '51e60bef-24d7-48a2-9e27-4e3f7e6c9fff'
    },
    {
      moduleUUID: 'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c50',
      testUUID: '018244af-c099-43e0-9be6-0eb928fb12d6'
    }
  ], { validate: true })

  // create testers
  await Tester.bulkCreate([
    {
      testerUUID: '86039e02-4edc-4607-a498-207789db36fc',
      firstname: 'Martin',
      lastname: 'Kocich',
      email: 'kocichmartin@gmail.com',
      sub: '109297358012991804394'
    },
    {
      testerUUID: 'b00be129-4e13-414d-b16b-8be8adba3cb2',
      firstname: 'Kateřina',
      lastname: 'Balíková',
      email: 'katerina.balikova@fake.com',
      sub: '109297358012991804394'
    },
    {
      testerUUID: '2cc1ede9-f9a8-468c-9b12-e248ea7d0bb2',
      firstname: 'Petr',
      lastname: 'Kozák',
      email: 'petr.kozak@fake.com',
      sub: '109297358012991804394'
    },
    {
      testerUUID: '153acd8f-f5dc-4ce5-8886-28e24bf4ce57',
      firstname: 'Vítězslav',
      lastname: 'Kříž',
      email: 'sprtokiller.6c@gmail.com',
      sub: '109297358012991804394'
    }
  ], { validate: true })
  // create 60 testers
  for (let i = 0; i < 600; i++) {
    await Tester.create({
      testerUUID: randomUUID(),
      firstname: 'Tester',
      lastname: i.toString(),
      email: `fake${i}@gmail.com`,
      sub: '109297358012991804394'
    })
  }

  // create groups
  await Group.bulkCreate([
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e053',
      groupName: 'Group with all testers 1',
      sub: '109297358012991804394'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e054',
      groupName: 'Group with all testers 2',
      sub: '109297358012991804394'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e055',
      groupName: 'Group with 3 anonymous testers',
      sub: '109297358012991804394'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e056',
      groupName: 'Group with 2 anonymous testers',
      sub: '109297358012991804394'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e057',
      groupName: 'Group with 2 testers and 1 anonymous',
      sub: '109297358012991804394'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058',
      groupName: 'Group with all testers and 8 anonymous',
      sub: '109297358012991804394'
    }
  ], { validate: true })

  // create group-tester relations
  await TesterGroup.bulkCreate([
    // assign all testers to first group
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e053',
      testerUUID: '86039e02-4edc-4607-a498-207789db36fc'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e053',
      testerUUID: 'b00be129-4e13-414d-b16b-8be8adba3cb2'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e053',
      testerUUID: '2cc1ede9-f9a8-468c-9b12-e248ea7d0bb2'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e053',
      testerUUID: '153acd8f-f5dc-4ce5-8886-28e24bf4ce57'
    },
    // assign all testers to second group
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e054',
      testerUUID: '86039e02-4edc-4607-a498-207789db36fc'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e054',
      testerUUID: 'b00be129-4e13-414d-b16b-8be8adba3cb2'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e054',
      testerUUID: '2cc1ede9-f9a8-468c-9b12-e248ea7d0bb2'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e054',
      testerUUID: '153acd8f-f5dc-4ce5-8886-28e24bf4ce57'
    },
    // assign 2 testers to 5th group
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e057',
      testerUUID: '86039e02-4edc-4607-a498-207789db36fc'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e057',
      testerUUID: '153acd8f-f5dc-4ce5-8886-28e24bf4ce57'
    },
    // assign all testers to 6th group
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058',
      testerUUID: '86039e02-4edc-4607-a498-207789db36fc'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058',
      testerUUID: 'b00be129-4e13-414d-b16b-8be8adba3cb2'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058',
      testerUUID: '2cc1ede9-f9a8-468c-9b12-e248ea7d0bb2'
    },
    {
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058',
      testerUUID: '153acd8f-f5dc-4ce5-8886-28e24bf4ce57'
    }
  ], { validate: true })

  // create anonymous testers
  await AnonymousTester.bulkCreate([
    // group 3 - 3 anonymous testers
    {
      anonymousTesterUUID: '030f2763-f39e-486f-9389-d7ba13e5c5d7',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e055'
    },
    {
      anonymousTesterUUID: '188d3f88-0e7b-4add-841c-af1042ad43be',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e055'
    },
    {
      anonymousTesterUUID: 'cecb2d1d-6f2a-4b0e-8863-26460630f550',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e055'
    },
    // group 4 - 2 anonymous testers
    {
      anonymousTesterUUID: '3a3c05ad-b0fc-4bb3-b943-ec8f423fb5dc',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e056'
    },
    {
      anonymousTesterUUID: '7202594d-0f54-431b-91f3-6ae8c62416b7',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e056'
    },
    // group 5 - 1 anonymous tester
    {
      anonymousTesterUUID: 'aab5cb8e-5e71-47c3-9d90-dc611ebf2053',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e057'
    },
    // group 6 - 8 anonymous testers
    {
      anonymousTesterUUID: 'c076c763-b8be-4fdc-821d-226308b1a30e',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058'
    },
    {
      anonymousTesterUUID: 'a2b5cb8e-5e71-47c3-9d90-dc611ebf2053',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058'
    },
    {
      anonymousTesterUUID: '9e580308-28b6-4ad1-98f5-6d8bc7b1cce9',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058'
    },
    {
      anonymousTesterUUID: 'c96d312d-4863-449b-a0ba-44823f0803c1',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058'
    },
    {
      anonymousTesterUUID: 'a0c930cd-41a8-4e76-a8ea-4cc8510f5504',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058'
    },
    {
      anonymousTesterUUID: 'f664bc65-246a-44fd-96b2-38da5acd1ca2',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058'
    },
    {
      anonymousTesterUUID: '66c28934-6aa9-459f-ada4-07a914cf1ead',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058'
    },
    {
      anonymousTesterUUID: '8c966715-1d71-48f3-b3c8-5907490bfb90',
      groupUUID: 'c2c3043f-4e92-4385-94be-0b810a87e058'
    }
  ], { validate: true })

}
export default dbInit 