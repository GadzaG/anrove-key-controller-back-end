import { BadRequestException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'

import { Role, User } from '@prisma/client'
import { randomBytes } from 'crypto'
import { PrismaService } from 'src/prisma.service'
import { AuthDto } from './auth.dto'
import { userOutput } from './user.output'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	public async getUsers(): Promise<User[]> {
		const users = await this.prisma.user.findMany()
		if (!users) throw new BadRequestException('Error!')
		return users
	}

	public async getById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			select: userOutput
		})
		return user
	}

	public async getByEmail(email: string) {
		return await this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	public async create({ email, name, password }: AuthDto) {
		return await this.prisma.user.create({
			data: {
				email,
				name: name ? name : '',
				password: await hash(password),
				secret_key: randomBytes(16).toString('hex')
			}
		})
	}

	public async deleteUser() {
		try {
			await this.prisma.user.deleteMany()
			return true
		} catch (error) {
			throw new BadRequestException(error)
		}
	}

	public async switchRole(userId: string) {
		const { id, role } = await this.getById(userId)
		const { role: switchedRole } = await this.prisma.user.update({
			where: { id },
			data: {
				role: role === Role.ADMIN ? Role.USER : Role.ADMIN
			}
		})
		return { message: `Now your role is: ${switchedRole}` }
	}
}
