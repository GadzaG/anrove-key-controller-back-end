import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException
} from '@nestjs/common'
import { Key } from '@prisma/client'
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

	async keyCheck(key: string): Promise<Key> {
		const keyData = await this.prisma.key.findUnique({
			where: {
				key
			}
		})

		if (!keyData) throw new NotFoundException('Key not found!')
		return keyData
	}
}
