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
    const user = await User.findOne({ where: { sub: '109297358012991804394' } });
    console.log(user?.toJSON());

    // create courses
    await Course.bulkCreate([
        {
            courseID: 1,
            name: 'xAPI_simple',
            author: 'Vítězslav Kříž',
            version: 5,
            groupHash: 'da41b34d-fbd7-4428-a4b5-7028cd401bdb',
            courseHash: 'x76CxTXo7UHsz92k',
            sub: '109297358012991804394'
        },
        {
            courseID: 2,
            name: 'xAPI_simple',
            author: 'Vítězslav Kříž',
            version: 7,
            groupHash: 'da41b34d-fbd7-4428-a4b5-7028cd401bdb',
            courseHash: 'bxR_bN7eF90WPICq',
            sub: '109297358012991804394'
        },
        {
            courseID: 4,
            name: 'Tvorba WWW stránek 1',
            author: 'Kateřina Chromčáková',
            version: 8,
            groupHash: 'd9fb6a33-e073-4603-aa7e-4c16b4b3b759',
            courseHash: '1cyFXEPcCxqzyOzf',
            sub: '109297358012991804394'
        }
    ])

    // get all courses and log them
    const courses = await Course.findAll();
    console.log(courses.map(course => course.toJSON()));
}
export default dbInit 