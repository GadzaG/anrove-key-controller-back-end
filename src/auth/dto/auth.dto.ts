import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'password must be min 6 symbols'
	})
	@IsString()
	password: string
}
