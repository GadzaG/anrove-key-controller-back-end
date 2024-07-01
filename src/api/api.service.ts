import { Injectable } from '@nestjs/common'
import { GlobalService } from 'src/global/global.service'
import { KeyService } from 'src/key/key.service'

@Injectable()
export class ApiService {
	constructor(
		private readonly globalService: GlobalService,
		private readonly keyService: KeyService
	) {}
}
