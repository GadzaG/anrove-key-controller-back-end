import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { Key } from '@prisma/client'
import * as crypto from 'crypto'
import { PrismaService } from 'src/prisma.service'
import { KeyCheckDto, KeyDto } from './key.dto'

@Injectable()
export class KeyService {
	constructor(private prisma: PrismaService) {}
	logger = new Logger()

	async getAll(productID: string): Promise<Key[]> {
		const keys = await this.prisma.key.findMany({
			where: {
				Product: { id: productID }
			}
		})
		if (!keys) throw new BadRequestException('Error!')
		return keys
	}

	async delete(keyID: string) {
		await this.prisma.key.delete({
			where: {
				id: keyID
			}
		})
	}

	async create({ keyCount, productID }: KeyDto) {
		try {
			for (let i = 0; i < keyCount; i++) {
				const key = crypto.randomBytes(16).toString('hex')
				await this.prisma.key.create({
					data: {
						key,
						Product: {
							connect: {
								id: productID
							}
						}
					}
				})
			}
			return true
		} catch (e) {
			this.logger.error(e)
			return false
		}
	}

	async keyCheck({ userID, data }: KeyCheckDto) {
		// console.log('userID\t' + userID)
		// console.log('data\t' + data)
		// const user = await this.prisma.user.findUnique({
		// 	where: {
		// 		id: userID
		// 	}
		// })
		// if (!user) {
		// 	throw new Error('User not found')
		// }
		// const decryptedData: Object = decrypt(data, user.secret_key)
		// console.log(decryptedData)
		// const key = await this.prisma.key.findUnique({
		// 	where: {
		// 		key: decryptedData['key']
		// 	}
		// })
		// if (!key) return { response: encrypt('key not found', user.secret_key) }
		// if (key.status == 'FREE') {
		// 	key.status = 'BUSY'
		// 	key.startAt = time.now()
		// 	key.endAt = product.subscriptionTime
		// }
	}
}
