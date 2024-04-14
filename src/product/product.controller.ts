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
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ProductDto } from './product.dto'
import { ProductService } from './product.service'

@Controller('user/product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userID: string) {
		return this.productService.getAll(userID)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@Body() dto: ProductDto, @CurrentUser('id') userID: string) {
		return this.productService.create(dto, userID)
	}

	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string) {
		return this.productService.delete(id)
	}
}
