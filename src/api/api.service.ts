import { Injectable } from '@nestjs/common'
import { GlobalService } from 'src/global/global.service'
import { KeyService } from 'src/key/key.service'
import { ApiDto } from './api.dto'

@Injectable()
export class ApiService {
	constructor(
		private readonly globalService: GlobalService,
		private readonly keyService: KeyService
	) {}

	async keyCheck(dto: ApiDto) {
		return this.keyService.keyCheck(dto)
	}

	async getGlobal(dto: ApiDto) {
		return this.globalService.getGlobal(dto)
	}

	async addJson(dto: ApiDto) {
		return this.keyService.addJson(dto)
	}
}
