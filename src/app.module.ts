import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import cookieSession from 'cookie-session'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { ReportsModule } from './reports/reports.module'
import { User } from './users/user.entity'
import { Report } from './reports/report.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}.local`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: process.env.NODE_ENV === 'test',
          entities: [User, Report]
        }
      }
    }),
    UsersModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ]
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.getOrThrow('COOKIE_KEY')]
        })
      )
      .forRoutes('*')
  }
}
