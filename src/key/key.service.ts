import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { KeyDto } from './key.dto'

@Injectable()
export class KeyService {
	constructor(private prisma: PrismaService) {}

	async getAll(productID: string) {
		return this.prisma.key.findMany({
			where: {
				Product: { id: productID }
			}
		})
	}

	async delete() {
		return 'true'
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

	async create(keyDto: KeyDto) {
		try {
			for (let i: number = 0; i < keyDto.keyCount; i++) {
				await this.prisma.key.create({
					data: {
						key: this.randomString(16),
						Product: {
							connect: {
								id: keyDto.productID
							}
						}
					}
				})
			}
			return 'done'
		} catch (e) {
			console.log(e)
		}
	}

	async keyCheck(key: string) {
		const keyData = this.prisma.key.findUnique({
			where: {
				key
			}
		})

		if (keyData) {
			return keyData
		} else {
			return 'key not found'
		}
	}
}
