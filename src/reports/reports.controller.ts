import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CreateReportDto } from './dtos/create-report.dto'
import { ReportsService } from './reports.service'
import { AuthGuard } from '../guards/auth.guards'
import { currentUser } from '../users/decorators/current-user.decorators'
import { User } from '../users/user.entity'
import { ReportDto } from './dtos/report.dto'
import { Serialize } from '../interceptors/serialize.interceptor'

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Serialize(ReportDto)
  @Post()
  async createReport(@Body() body: CreateReportDto, @currentUser() user: User) {
    const report = await this.reportsService.create(body, user)

    return report
  }
}
