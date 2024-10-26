import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ApiDto } from 'src/api/api.dto'
import { PrismaService } from 'src/prisma.service'
import { GlobalDto } from './global.dto'

interface IExistingGlobals {
	id: string
	varName: string
	optional: boolean
}

@Injectable()
export class GlobalService {
	constructor(private prisma: PrismaService) {}

	public async getGlobal(dto: ApiDto) {
		// const result = await this.prisma.global.findMany({
		// 	where: {
		// 		varName
		// 	},
		// 	select: {
		// 		varData: true
		// 	}
		// })
		// if (!result) throw new NotFoundException('key not found')
		// return result
	}

	public async getGlobals(id: string) {
		const result = await this.prisma.global.findMany({
			where: {
				userID: id
			}
		})

		if (!result) throw new NotFoundException('key not found')

		return result
	}

	public async createGlobal({ varName, varData }: GlobalDto, id: string) {
		await this.existingGlobals({ id, varName, optional: true })

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

	public async changeGlobal({ varName, varData }: GlobalDto, id: string) {
		const existingGlobal = await this.existingGlobals({
			id,
			varName,
			optional: false
		})

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

	public async deleteGlobal(
		{ varName }: Pick<GlobalDto, 'varName'>,
		id: string
	) {
		try {
			const existingGlobal = await this.existingGlobals({
				id,
				optional: false,
				varName
			})
			const deletedGlobal = await this.prisma.global.delete({
				where: {
					id: existingGlobal.id
				}
			})
			return deletedGlobal
		} catch (error) {
			throw new BadRequestException(`Error`, error)
		}
	}

	// TOOLS
	public async existingGlobals({ id, optional, varName }: IExistingGlobals) {
		const existingGlobal = await this.prisma.global.findFirst({
			where: {
				userID: id,
				varName: varName
			}
		})
		if (optional ? existingGlobal : !existingGlobal) {
			throw new NotFoundException(`varName ${varName} not found for user ${id}`)
		}
		return existingGlobal
	}
}
