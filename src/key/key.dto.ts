import { IsNumber, IsString } from 'class-validator'

export class KeyDto {
	@IsString()
	productID: string

	@IsNumber()
	keyCount: number
}

export class KeyCheckDto {
	@IsString()
	userID: string
	@IsString()
	productID: string
	@IsString()
	key: string
}
