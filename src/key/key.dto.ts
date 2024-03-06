import { IsNumber, IsString } from 'class-validator'

export class KeyDto {
	@IsString()
	productID: string

	@IsNumber()
	keyCount: number
}
