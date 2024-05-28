import { Prisma } from '@prisma/client'

export const userOutput: Prisma.UserSelect = {
	email: true,
	createdAt: true,
	updatedAt: true,
	id: true,
	name: true,
	password: false,
	role: true
}
