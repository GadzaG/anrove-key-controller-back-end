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
import { KeyDto } from './key.dto'
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

	@HttpCode(200)
	@Post('key-check/:key')
	async keyCheck(@Param('key') key: string) {
		return await this.keyService.keyCheck(key)
	}
}
