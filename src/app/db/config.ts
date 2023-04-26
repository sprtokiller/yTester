import { Sequelize } from 'sequelize-typescript'
import { Dialect } from 'sequelize/types'

const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbHost = process.env.DB_HOST
const dbDriver = process.env.DB_DRIVER as Dialect
const dbPassword = process.env.DB_PASSWORD

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  //host: dbHost,
  dialect: 'sqlite',
  storage: './__db__/database.sqlite',
  models: [__dirname + '/models'],
  logging: false,
  define: {
    timestamps: false
  }
})

export default sequelizeConnection