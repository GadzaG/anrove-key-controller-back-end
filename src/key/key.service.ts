import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { KeyDto } from './key.dto'

@Injectable()
export class KeyService {
	constructor(private prisma: PrismaService) {}

	async getAll(userID: string, productID: string) {
		return this.prisma.key.findMany({
			where: {
				Product: { id: productID }
			}
		})
	}

	private randomString(length: number) {
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let result = ''

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length)
			result += characters.charAt(randomIndex)
		}

		return result
	}

	async create(keyDto: KeyDto, productID) {
		return this.prisma.key.create({
			data: {
				key: this.randomString(16),
				Product: {
					connect: {
						id: productID
					}
				}
			}
		})
	}
}
