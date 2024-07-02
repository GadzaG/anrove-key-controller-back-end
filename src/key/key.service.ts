import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Key } from '@prisma/client'
import * as crypto from 'crypto'
import { ApiDto } from 'src/api/api.dto'
import { isHasMorePagination } from 'src/base/pagination/is-has-more'
import { PaginationArgsWithSearchTerm } from 'src/base/pagination/pagination.args'
import { PrismaService } from 'src/prisma.service'
import { KeyDto } from './key.dto'

@Injectable()
export class KeyService {
	constructor(private prisma: PrismaService) {}
	logger = new Logger()

	async getAll(
		productID: string,
		args?: PaginationArgsWithSearchTerm
	): Promise<{ items: Key[]; isHasMore: boolean }> {
		const keys = await this.prisma.key.findMany({
			skip: +args?.skip,
			take: +args?.take,
			where: {
				Product: { id: productID }
			}
		})
		if (!keys)
			throw new NotFoundException('Keys not found!', {
				cause: 'ProductId not found!',
				description: 'Keys with this ProductId not found!'
			})
		const totalCount = await this.prisma.key.count({
			where: {
				Product: { id: productID }
			}
		})
		const isHasMore = isHasMorePagination(totalCount, +args?.skip, +args.take)
		return { items: keys, isHasMore }
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

	async addJson({ userID, data }: ApiDto) {}

	async keyCheck({ userID, data }: ApiDto) {
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
