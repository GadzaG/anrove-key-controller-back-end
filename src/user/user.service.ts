import { BadRequestException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'

import { PrismaService } from 'src/prisma.service'
import { AuthDto } from './auth.dto'
import { userOutput } from './user.output'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getUsers() {
		return this.prisma.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				password: false,
				role: true
			}
		})
	}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			select: userOutput
		})
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	async create(dto: AuthDto) {
		const data = {
			email: dto.email,
			name: dto.name,
			password: await hash(dto.password)
		}

		return await this.prisma.user.create({
			data
		})
	}

	async deleteUser() {
		try {
			await this.prisma.user.deleteMany()
			return true
		} catch (error) {
			throw new BadRequestException(error)
		}
	}
	async switchRole(userId: string) {
		const { id, role } = await this.getById(userId)
		const { role: switchedRole } = await this.prisma.user.update({
			where: { id },
			data: {
				role: role === 'ADMIN' ? 'USER' : 'ADMIN'
			}
		})
		return { message: `Now your role is: ${switchedRole}` }
	}
}
