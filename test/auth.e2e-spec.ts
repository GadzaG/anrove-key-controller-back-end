import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from '@prisma/client'
import * as cookieParser from 'cookie-parser'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { PrismaService } from './../src/prisma.service'
import {
	BadRequest,
	Forbidden,
	Unauthorized,
	UnauthorizedVoid
} from './../src/utils/status-codes'
interface UserWithIsoTimes extends Omit<User, 'createdAt' | 'updatedAt'> {
	createdAt: string
	updatedAt: string
}

describe('AuthController (e2e)', () => {
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
			providers: [PrismaService]
		}).compile()

		app = moduleFixture.createNestApplication()
		prisma = app.get<PrismaService>(PrismaService)
		app.use(cookieParser())
		app.enableCors({
			origin: [client, server, server.replace('api', '')],
			credentials: true,
			exposedHeaders: 'set-cookie'
		})
		auth = async isAdmin => {
			const auth: request.Response = await request(app.getHttpServer())
					.post('/auth/login')
					.send({
						password: isAdmin ? '55Kirill55' : '123456',
						email: isAdmin ? 'admin@admin.ru' : 'test@test.ru'
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
				updatedAt: new Date(user.updatedAt).toISOString()
			}
		}
		await app.init()
	})
	afterAll(async () => {
		await prisma.$disconnect()
		await app.close()
	})

	// USERS LIST
	it('/users (GET) USERS-LIST 403', async () => {
		const { accessToken, cookie } = await auth()
		return request(app.getHttpServer())
			.get('/users')
			.set('Cookie', cookie)
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(Forbidden.statusCode)
			.expect(Forbidden)
	})
	it('/users (GET) USERS-LIST 200', async () => {
		const { accessToken, cookie } = await auth(true),
			users = await prisma.user.findMany()

		return request(app.getHttpServer())
			.get(`/users`)
			.set('Cookie', cookie)
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200)
			.expect(
				users.map(user => ({
					...user,
					createdAt: new Date(user.createdAt).toISOString(),
					updatedAt: new Date(user.updatedAt).toISOString()
				}))
			)
	})
	it('/users (GET) USERS-LIST 401', async () => {
		return request(app.getHttpServer())
			.get('/users')
			.expect(401)
			.expect(Unauthorized)
	})

	// LOGIN
	it('/auth/login (POST) LOGIN 200', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.set('Accept', 'application/json')
			.send({
				password: '123456',
				email: 'test@test.ru'
			})
			.expect(200)
			.expect('Content-Type', /json/)
	})
	it('/auth/login (POST) LOGIN 401', async () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.set('Accept', 'application/json')
			.send({
				password: '123457',
				email: 'test@test.ru'
			})
			.expect({
				message: 'Email or password invalid',
				error: 'Unauthorized',
				statusCode: 401
			})
			.expect(401)
			.expect('Content-Type', /json/)
	})

	// REGISTER
	it('/auth/register (POST) REGISTER 200', async () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({
				password: '123456',
				email: faker.internet.email()
			})
			.expect(200)
			.expect('Content-Type', /json/)
	})
	it('/auth/register (POST) REGISTER 400 bad email', async () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({
				password: '123456',
				email: test
			})
			.expect(BadRequest(['email must be an email']))
			.expect(BadRequest(['email must be an email']).statusCode)
			.expect('Content-Type', /json/)
	})
	it('/auth/register (POST) REGISTER 400 bad password', async () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({
				password: '12345',
				email: faker.internet.email()
			})
			.expect(BadRequest(['Password must be at least 6 characters long']))
			.expect(
				BadRequest(['Password must be at least 6 characters long']).statusCode
			)
			.expect('Content-Type', /json/)
	})
	it('/auth/register (POST) REGISTER 400 user exist', async () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.set('Accept', 'application/json')
			.send({
				password: '123456',
				email: 'test@test.ru'
			})
			.expect(BadRequest('User already exists'))
			.expect(BadRequest('User already exists').statusCode)
			.expect('Content-Type', /json/)
	})

	// ACCESS TOKEN
	it('/auth/login/access-token (POST) new ACCESS TOKEN 200', async () => {
		const { cookie } = await auth()
		return request(app.getHttpServer())
			.post('/auth/login/access-token')
			.set('Cookie', cookie)
			.set('Accept', 'application/json')
			.expect(200)
			.expect('Content-Type', /json/)
	})
	it('/auth/login/access-token (POST) new ACCESS TOKEN 401', async () => {
		return request(app.getHttpServer())
			.post('/auth/login/access-token')
			.set('Accept', 'application/json')
			.expect(UnauthorizedVoid('Refresh token not passed'))
			.expect(UnauthorizedVoid('Refresh token not passed').statusCode)
			.expect('Content-Type', /json/)
	})

	// PROFILE
	it('/users/profile (GET) PROFILE 200', async () => {
		const { accessToken, cookie } = await auth()
		return request(app.getHttpServer())
			.get('/users/profile')
			.set('Cookie', cookie)
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${accessToken}`)
			.expect(200)
			.expect('Content-Type', /json/)
	})
	it('/users/profile (GET) PROFILE 401', async () => {
		return request(app.getHttpServer())
			.get('/users/profile')
			.set('Accept', 'application/json')
			.expect(Unauthorized.statusCode)
			.expect('Content-Type', /json/)
			.expect(Unauthorized)
	})
})
