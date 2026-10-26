import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CreateReportDto } from './dtos/create-report.dto'
import { ReportsService } from './reports.service'
import { AuthGuard } from '../guards/auth.guards'

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  async createReport(@Body() body: CreateReportDto) {
    const report = await this.reportsService.create(body)

    return report
  }
}
