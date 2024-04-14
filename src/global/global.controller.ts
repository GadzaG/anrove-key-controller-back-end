import { Controller, Get, Post } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { GlobalService } from './global.service'

@Controller('global')
export class GlobalController {
	constructor(private readonly globalService: GlobalService) {}

	@Post('get-global')
	async getGlobal() {}

	@Get('get-globals')
	@Auth()
	async getGlobals() {}

	@Post('create-global')
	@Auth()
	async createGlobal() {}

	@Post('change-global')
	@Auth()
	async changeGlobal() {}
}
