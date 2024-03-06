import { IsNumber, IsString, MaxLength } from 'class-validator'

export class ProductDto {
	@IsString()
	@MaxLength(64, {
		message: 'too much symbols(max is 64)'
	})
	name: string

	@IsNumber()
	subscriptionTime: number
}
