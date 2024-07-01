import { Controller } from '@nestjs/common'
import { ApiService } from './api.service'

@Controller('')
export class ApiController {
	constructor(private readonly apiService: ApiService) {}

	async keyCheck() {}

	async getGlobal() {}

	async addJson() {}
}
