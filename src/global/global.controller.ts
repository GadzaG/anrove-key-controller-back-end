import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { GlobalAPIDto, GlobalDto } from './global.dto'
import { GlobalService } from './global.service'

@Controller('global')
export class GlobalController {
	constructor(private readonly globalService: GlobalService) {}

	// API
	@Post('get-global')
	async getGlobal(@Body() dto: GlobalAPIDto) {
		return this.globalService.getGlobal(dto)
	}

	// MORE...
	@Get('get-globals')
	@Auth()
	async getGlobals(@CurrentUser('id') id: string) {
		const globals = await this.globalService.getGlobals(id)
		return globals
	}

	@Post('create-global')
	@Auth()
	async createGlobal(@Body() dto: GlobalDto, @CurrentUser('id') id: string) {
		const globals = await this.globalService.createGlobal(dto, id)
		return globals
	}

	@Put('change-global')
	@Auth()
	async changeGlobal(@Body() dto: GlobalDto, @CurrentUser('id') id: string) {
		return this.globalService.changeGlobal(dto, id)
	}

	@Delete('delete-global')
	@Auth()
	async deleteGlobal(
		@Body() dto: Pick<GlobalAPIDto, 'varName'>,
		@CurrentUser('id') id: string
	) {
		await this.globalService.deleteGlobal(dto, id)
		return true
	}
}
