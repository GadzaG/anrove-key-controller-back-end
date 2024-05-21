import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string) {
		return await this.prisma.user.findUnique({
			where: { id },
			include: { products: true }
		})
	}

	async getByEmail(email: string) {
		return await this.prisma.user.findUnique({
			where: { email }
		})
	}

	async create({ email, password }: AuthDto) {
		const data = {
			email: email,
			name: '',
			password: await hash(password)
		}
		return await this.prisma.user.create({
			data
		})
	}

	async getProfile(id: string) {
		const profile = await this.getById(id),
			totalProductsLenght = profile.products.length,
			totalProducts = profile.products,
			{ password, ...rest } = profile // eslint-disable-line

		return {
			user: rest,
			productsLenght: totalProductsLenght,
			products: totalProducts
		}
	}

	async update(id: string, dto: UserDto) {
		let data = dto

		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) }
		}

		return this.prisma.user.update({
			where: {
				id
			},
			data,
			select: {
				name: true,
				email: true
			}
		})
	}
}
