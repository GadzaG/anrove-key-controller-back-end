import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ApiDto } from 'src/api/api.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { GlobalDto } from './global.dto'
import { GlobalService } from './global.service'

@Controller('global')
export class GlobalController {
	constructor(private readonly globalService: GlobalService) {}

	// API
	@Post('get-global')
	@UsePipes(new ValidationPipe())
	async getGlobal(@Body() dto: ApiDto) {
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
	@UsePipes(new ValidationPipe())
	async createGlobal(@Body() dto: GlobalDto, @CurrentUser('id') id: string) {
		const globals = await this.globalService.createGlobal(dto, id)
		return globals
	}

	@Put('change-global')
	@Auth()
	@UsePipes(new ValidationPipe())
	async changeGlobal(@Body() dto: GlobalDto, @CurrentUser('id') id: string) {
		return this.globalService.changeGlobal(dto, id)
	}

	// @Delete('delete-global')
	// @Auth()
	// @UsePipes(new ValidationPipe())
	// async deleteGlobal(
	// 	@Body() dto: Pick<ApiDto, 'data'>,
	// 	@CurrentUser('id') id: string
	// ) {
	// 	await this.globalService.deleteGlobal(dto, id)
	// 	return true
	// }
}
