import { Course } from './models/Course'
import { User } from './models/User'
import { Test } from './models/Test'
import { Module_1 } from './models/Module_1'
import sql from './config';
import { Month, EndType, ContentType } from '../utils';

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
            endType: EndType.AUTO,
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
            endType: EndType.AUTO,
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
            endType: EndType.AUTO,
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

    // get all tests and if they have module_1, add a modules[] array with the value of module_1.moduleUUID
    const tests = await Test.findAll({
        include: [
            {
                model: Module_1,
                attributes: ['moduleUUID']
            }
        ]
    })
}
export default dbInit 