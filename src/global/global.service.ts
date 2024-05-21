import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { GlobalAPIDto, GlobalDto } from './global.dto'

@Injectable()
export class GlobalService {
	constructor(private prisma: PrismaService) {}

	async getGlobal({ userID, varName }: GlobalAPIDto) {
		const result = await this.prisma.global.findMany({
			where: {
				userID,
				varName
			},
			select: {
				varData: true
			}
		})
		if (!result) throw new NotFoundException('key not found')
		return result
	}

	async getGlobals(id: string) {
		const result = await this.prisma.global.findMany({
			where: {
				userID: id
			}
		})

		if (!result) throw new NotFoundException('key not found')

		return result
	}

	async createGlobal({ varName, varData }: GlobalDto, id: string) {
		const existingGlobal = await this.prisma.global.findFirst({
			where: {
				userID: id,
				varName: varName
			}
		})

		if (existingGlobal) {
			throw new NotFoundException(
				`varName ${varName} already exists for user ${id}`
			)
		}

		const newGlobal = await this.prisma.global.create({
			data: {
				varName: varName,
				varData: varData,
				User: {
					connect: {
						id: id
					}
				}
			}
		})

		return newGlobal
	}

	async changeGlobal({ varName, varData }: GlobalDto, id: string) {
		const existingGlobal = await this.prisma.global.findFirst({
			where: {
				userID: id,
				varName: varName
			}
		})

		if (!existingGlobal) {
			throw new NotFoundException(`varName ${varName} not found for user ${id}`)
		}

		const updatedGlobal = await this.prisma.global.update({
			where: {
				id: existingGlobal.id
			},
			data: {
				varData: varData
			}
		})

		return updatedGlobal
	}

	async deleteGlobal({ varName }: Pick<GlobalDto, 'varName'>, id: string) {
		const existingGlobal = await this.prisma.global.findFirst({
			where: {
				userID: id,
				varName: varName
			}
		})

		if (!existingGlobal) {
			throw new NotFoundException(`varName ${varName} not found for user ${id}`)
		}

		const deletedGlobal = await this.prisma.global.delete({
			where: {
				id: existingGlobal.id
			}
		})

		return deletedGlobal
	}
}
