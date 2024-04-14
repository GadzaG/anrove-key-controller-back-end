import { BadRequestException, Injectable } from '@nestjs/common'
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
			let newKeys = null
			let newkeysList: Object[]
			for (let i: number = 0; i < keyDto.keyCount; i++) {
				newkeysList.push(
					(newKeys = await this.prisma.key.create({
						data: {
							key: this.randomString(16),
							Product: {
								connect: {
									id: keyDto.productID
								}
							}
						}
					}))
				)
				console.log(newkeysList)
				if (!newKeys) throw new BadRequestException('erorororororor')
			}
			return newKeys
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
