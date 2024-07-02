import { Controller, Get } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}
	@Auth('ADMIN')
	@Get('/registrations-by-month')
	async getRegistrationsByMonth() {
		return await this.statisticsService.getUserRegistrationsByMonth()
	}

	@Auth('ADMIN')
	@Get('/numbers')
	async getNumbers() {
		return await this.statisticsService.getNumbers()
	}
}
