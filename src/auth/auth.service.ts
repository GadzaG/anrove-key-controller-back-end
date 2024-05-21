import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private configService: ConfigService
	) {}
	DEVELOPMENT = this.configService.get<string>('NODE_ENV')
	HOST = this.configService.get<string>('HOST')
	CLIENT_PORT = this.configService.get<number>('CLIENT_PORT')
	domain = `${this.HOST}:${this.CLIENT_PORT}`
	IS_DEV = this.DEVELOPMENT === 'development'
	logger = new Logger()
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email)

		if (oldUser) throw new BadRequestException('User already exists')

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto)

		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	private issueTokens(userId: string) {
		const data = { id: userId }
		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})
		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)
		if (!user) throw new NotFoundException('user not found')

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('invalid password')

		return user
	}

	addRefreshTokenToResponse({ cookie }: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: this.HOST,
			expires: expiresIn,
			secure: true,
			sameSite: this.IS_DEV ? 'none' : 'lax'
		})
	}

	removeRefreshTokenFromResponse({ cookie }: Response) {
		cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: this.HOST,
			expires: new Date(0),
			secure: true,
			sameSite: this.IS_DEV ? 'none' : 'lax'
		})
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.getById(result.id)

		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}
}
