import { IsString } from 'class-validator'

export class ApiDto {
	@IsString()
	userID: string

	@IsString()
	data: string
}
