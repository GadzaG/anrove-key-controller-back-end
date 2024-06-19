import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException
} from '@nestjs/common'
import { Key } from '@prisma/client'
import * as crypto from 'crypto'
import { PrismaService } from 'src/prisma.service'
import { randomString } from 'src/utils/random-string'
import { KeyDto } from './key.dto'

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

	async delete() {
		return true
	}

	async create({ keyCount, productID }: KeyDto) {
		try {
			for (let i: number = 0; i < keyCount; i++) {
				await this.prisma.key.create({
					data: {
						key: await randomString(16),
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

	async keyCheck(keyData: string) {
		console.log(keyData)

		// Расшифровываем запрос
		const iv = Buffer.from(keyData.slice(0, 16), 'base64')
		const encryptedRequest = Buffer.from(keyData.slice(16), 'base64')
		const decipher = crypto.createDecipheriv(
			'aes-256-cbc',
			Buffer.from(process.env.SECRET_KEY, 'utf8'),
			iv
		)
		let decryptedRequest = decipher.update(encryptedRequest, 'base64', 'utf8')
		decryptedRequest += decipher.final('utf8')
		const jsonRequest = JSON.parse(decryptedRequest)

		console.log(jsonRequest.key)

		// Ищем ключ в базе данных
		const checkKeyData = await this.prisma.key.findUnique({
			where: {
				key: jsonRequest.key
			}
		})

		// Проверяем, что ключ существует
		if (!checkKeyData) {
			throw new NotFoundException('Key not found!')
		}

		return keyData
	}
	// async keyCheck({ userID, productID, key }: KeyCheckDto) {
	// 	const keyData = await this.prisma.key.findFirst({
	// 		where: {
	// 			key
	// 		}
	// 	})

	// 	if (!keyData) return { access: false }

	// 	return { access: true }
	// }
}
