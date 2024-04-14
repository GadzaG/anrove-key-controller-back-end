import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
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
		return this.keyService.getAll(productID)
	}

	@Delete()
	@Auth()
	delete() {}

	@HttpCode(200)
	@Post('create')
	@Auth()
	async create(@Body() dto: KeyDto) {
		return this.keyService.create(dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('key-check/:key')
	async keyCheck(@Param('key') key: string) {
		return this.keyService.keyCheck(key)
	}
}
