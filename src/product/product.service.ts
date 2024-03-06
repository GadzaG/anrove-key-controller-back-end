import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProductDto } from './product.dto'

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async getAll(userID: string) {
		return this.prisma.product.findMany({
			where: {
				userID: userID
			}
		})
	}

	async create(dto: ProductDto, userId: string) {
		return this.prisma.product.create({
			data: {
				...dto,
				User: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async delete(productID: string) {
		return this.prisma.product.delete({ where: { id: productID } })
	}
}
