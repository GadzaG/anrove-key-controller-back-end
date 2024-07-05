import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { verify } from 'argon2'
import { Response } from 'express'

import { ConfigService } from '@nestjs/config'

import { Role } from '@prisma/client'
import { isDev } from 'src/utils/is-dev'
import { AuthDto } from '../user/auth.dto'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private readonly userService: UserService,
		private readonly configService: ConfigService
	) {}
	private DOMAIN = this.configService.get<string>('DOMAIN')
	private logger = new Logger()
	public EXPIRE_DAY_REFRESH_TOKEN = 1
	public REFRESH_TOKEN_NAME = 'refreshToken'

	public async login(dto: AuthDto) {
		const user = await this.validateUser(dto),
			tokens = await this.issueTokens({
				email: user.email,
				id: user.id,
				role: user.role
			})
		delete user['password']
		return {
			user,
			...tokens
		}
	}

	public async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email)

		if (oldUser) throw new BadRequestException('User already exists')

		const user = await this.userService.create(dto),
			tokens = await this.issueTokens({
				email: user.email,
				id: user.id,
				role: user.role
			})
		delete user['password']
		return {
			user,
			...tokens
		}
	}

	public async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')
		const user = await this.userService.getById(result.id),
			tokens = await this.issueTokens({
				email: user.email,
				id: user.id,
				role: user.role
			})
		delete user['password']
		return {
			user,
			...tokens
		}
	}

	private async issueTokens({
		id,
		role,
		email
	}: {
		email: string
		id: string
		role?: Role
	}) {
		const data = { id, role, email },
			accessToken = this.jwt.sign(data, {
				expiresIn: '1h'
			}),
			refreshToken = this.jwt.sign(data, {
				expiresIn: '7d'
			})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) throw new UnauthorizedException('Email or password invalid')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Email or password invalid')

		return user
	}

	public addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expires = new Date(),
			{ DOMAIN: domain, REFRESH_TOKEN_NAME } = this,
			httpOnly = true,
			sameSite = isDev(this.configService) ? 'none' : 'lax',
			secure = true

		expires.setDate(expires.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly,
			domain,
			expires,
			secure,
			sameSite
		})
	}

	public removeRefreshTokenFromResponse(res: Response) {
		const { DOMAIN: domain, REFRESH_TOKEN_NAME } = this,
			sameSite = isDev(this.configService) ? 'none' : 'lax',
			secure = true,
			expires = new Date(),
			httpOnly = true

		res.cookie(REFRESH_TOKEN_NAME, '', {
			httpOnly,
			domain,
			expires,
			secure,
			sameSite
		})
	}
}
