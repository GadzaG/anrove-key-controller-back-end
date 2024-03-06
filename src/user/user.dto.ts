import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UserDto {
	@IsOptional()
	@IsEmail()
	email: string

	@IsOptional()
	@MinLength(6, {
		message: 'password must be min 6 symbols'
	})
	@IsString()
	password: string
}
