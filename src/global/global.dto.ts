import { IsString } from 'class-validator'

export class GlobalDto {
	@IsString()
	varName: string

	@IsString()
	varData: string
}
