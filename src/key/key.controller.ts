import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { KeyCheckDto, KeyDto } from './key.dto'
import { KeyService } from './key.service'

@Controller('key')
export class KeyController {
	constructor(private readonly keyService: KeyService) {}

	@Get('get-all/:productID')
	@Auth()
	async getAll(@Param('productID') productID: string) {
		return await this.keyService.getAll(productID)
	}

	@Delete('delete')
	@Auth()
	async delete() {
		return await this.keyService.delete()
	}

	@HttpCode(200)
	@Post('create')
	@Auth()
	async create(@Body() dto: KeyDto) {
		return await this.keyService.create(dto)
	}

	@Post('key-check')
	async keyCheck(@Body() dto: KeyCheckDto) {
		return await this.keyService.keyCheck(dto)
	}
}
