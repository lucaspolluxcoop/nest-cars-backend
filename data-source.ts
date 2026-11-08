import { User } from './src/users/user.entity'
import { Report } from './src/reports/report.entity'
import { configDotenv } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'

configDotenv({ path: `.env.${process.env.NODE_ENV ?? 'development'}.local` })

if (!process.env.DB_NAME) {
  throw new Error('DB_NAME is not setup')
}

if (!process.env.DB_TYPE) {
  throw new Error('DB_TYPE is not setup')
}

export default new DataSource({
  type: process.env.DB_TYPE ?? 'sqlite',
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User, Report],
  migrations: ['./src/migrations/*.ts']
} as DataSourceOptions)
