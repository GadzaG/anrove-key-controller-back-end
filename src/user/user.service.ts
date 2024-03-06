import { Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
			include: { products: true }
		})
	}

	getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email }
		})
	}

	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: '',
			password: await hash(dto.password)
		}
		console.log(`email:${user.email}\tpassword:${user.password}`)
		return await this.prisma.user.create({
			data: user
		})
	}

	async getProfile(id: string) {
		const profile = await this.getById(id)

		const totalProductsLenght = profile.products.length
		const totalProducts = profile.products

		const { password, ...rest } = profile

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
