import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '@prisma/client'
import * as cookieParser from 'cookie-parser'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { PrismaService } from './../src/prisma.service'
interface UserWithIsoTimes extends Omit<User, 'createdAt' | 'updatedAt'> {
	createdAt: string
	updatedAt: string
}

describe('AppController (e2e)', () => {
	let app: INestApplication,
		prisma: PrismaService,
		client: string = process.env.CLIENT,
		server: string = process.env.CLIENT,
		auth: (
			isAdmin?: boolean
		) => Promise<{ cookie: string; accessToken: string }>,
		findUser: () => Promise<UserWithIsoTimes>
	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			providers: [PrismaService],
		}).compile()

		app = moduleFixture.createNestApplication()
		prisma = app.get<PrismaService>(PrismaService)
		app.use(cookieParser())
		app.enableCors({
			origin: [client, server, server.replace('api', '')],
			credentials: true,
			exposedHeaders: 'set-cookie',
		})
		auth = async (isAdmin) => {
			const auth: request.Response = await request(app.getHttpServer())
					.post('/auth/login')
					.send({
						password: isAdmin ? '55Kirill55' : '123456',
						email: isAdmin ? 'admin@admin.ru' : 'test@test.ru',
					})
					.expect(200),
				cookie = auth.headers['set-cookie']
			return { cookie, accessToken: auth.body.accessToken }
		}
		findUser = async () => {
			const users = await prisma.user.findMany(),
				user = await prisma.user.findUnique({ where: { id: users[0].id } })
			return {
				...user,
				createdAt: new Date(user.createdAt).toISOString(),
				updatedAt: new Date(user.updatedAt).toISOString(),
			}
		}
		await app.init()
	})
	afterAll(async () => {
		await prisma.$disconnect()
		await app.close()
	})
	it('/math (POST) MATH', () => {
		return request(app.getHttpServer())
			.post('/math')
			.send({ count: 4 })
			.expect(200)
			.expect({ message: 'See to console' })
	})
})
