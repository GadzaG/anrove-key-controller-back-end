import { Body, Controller, Post } from '@nestjs/common'
import { ApiDto } from './api.dto'
import { ApiService } from './api.service'

@Controller('')
export class ApiController {
	constructor(private readonly apiService: ApiService) {}

	@Post('key-check')
	async keyCheck(@Body() dto: ApiDto) {
		return await this.apiService.keyCheck(dto)
	}

	@Post('get-global')
	async getGlobal(@Body() dto: ApiDto) {
		return await this.apiService.getGlobal(dto)
	}

	@Post('add-json')
	async addJson(@Body() dto: ApiDto) {
		return await this.apiService.addJson(dto)
	}
}
