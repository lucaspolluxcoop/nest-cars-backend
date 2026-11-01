import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Query,
  Get,
  UseGuards
} from '@nestjs/common'
import { CreateReportDto } from './dtos/create-report.dto'
import { ReportsService } from './reports.service'
import { AuthGuard } from '../guards/auth.guards'
import { currentUser } from '../users/decorators/current-user.decorators'
import { User } from '../users/user.entity'
import { ReportDto } from './dtos/report.dto'
import { Serialize } from '../interceptors/serialize.interceptor'
import { ApprovedReportDto } from './dtos/approved-report.dto'
import { AdminGuard } from '../guards/admin.guard'
import { GetEstimateDto } from './dtos/get-estimate.dto'

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

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async approveReport(
    @Param('id') id: string,
    @Body() body: ApprovedReportDto
  ) {
    return await this.reportsService.changeApproval(parseInt(id), body.approved)
  }

  @Get()
  async getEstimate(@Query() query: GetEstimateDto) {
    return await this.reportsService.createEstimate(query)
  }
}
