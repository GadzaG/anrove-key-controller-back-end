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
import { AuthDto } from '../user/auth.dto'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private configService: ConfigService
	) {}
	HOST = this.configService.get<string>('HOST')
	IS_DEV = this.configService.get<string>('NODE_ENV') === 'development'
	logger = new Logger()
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'

	async login(dto: AuthDto) {
		// eslint-disable-next-line
		const { password, ...user } = await this.validateUser(dto),
			tokens = await this.issueTokens({
				email: user.email,
				id: user.id,
				role: user.role
			})

		return {
			user,
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email)

		if (oldUser) throw new BadRequestException('User already exists')

		// eslint-disable-next-line
		const { password, ...user } = await this.userService.create(dto),
			tokens = await this.issueTokens({
				email: user.email,
				id: user.id,
				role: user.role
			})

		return {
			user,
			...tokens
		}
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException('Invalid refresh token')
		// eslint-disable-next-line
		const { password, ...user } = await this.userService.getById(result.id),
			tokens = await this.issueTokens({
				email: user.email,
				id: user.id,
				role: user.role
			})

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

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expires = new Date()
		expires.setDate(expires.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)
		const { HOST: domain, IS_DEV, REFRESH_TOKEN_NAME } = this

		res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain,
			expires,
			secure: true,
			sameSite: IS_DEV ? 'none' : 'lax'
			// sameSite: 'none'
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		const { HOST: domain, IS_DEV, REFRESH_TOKEN_NAME } = this

		res.cookie(REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain,
			expires: new Date(0),
			secure: true,
			sameSite: IS_DEV ? 'none' : 'lax'
		})
	}
}
