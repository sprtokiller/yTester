import { Course } from './models/Course'
import { User } from './models/User'
import sql from './config';

const dbInit = async () => {
    // reset database
    await sql.sync({ force: true });

    // create users
    await User.bulkCreate([
        {
            sub: '109297358012991804394',
            email: 'vitezslavkriz24@gmail.com'
        }
    ])

    // get all users and log them
    const users = await User.findAll()

    // create courses
    await Course.bulkCreate([
        {
            courseID: 1,
            name: 'xAPI_simple',
            author: 'Vítězslav Kříž',
            version: 5,
            groupHash: 'da41b34d-fbd7-4428-a4b5-7028cd401bdb',
            courseHash: 'x76CxTXo7UHsz92k'
        },
        {
            courseID: 2,
            name: 'xAPI_simple',
            author: 'Vítězslav Kříž',
            version: 7,
            groupHash: 'da41b34d-fbd7-4428-a4b5-7028cd401bdb',
            courseHash: 'bxR_bN7eF90WPICq'
        },
        {
            courseID: 4,
            name: 'Tvorba WWW stránek 1',
            author: 'Kateřina Chromčáková',
            version: 8,
            groupHash: 'd9fb6a33-e073-4603-aa7e-4c16b4b3b759',
            courseHash: '1cyFXEPcCxqzyOzf'
        }
    ])
}
export default dbInit 