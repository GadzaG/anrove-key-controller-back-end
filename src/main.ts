import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const { setGlobalPrefix, use, get, enableCors, listen, useGlobalPipes } =
		await NestFactory.create(AppModule)

	await setGlobalPrefix('api')
	await use(cookieParser())
	await useGlobalPipes(new ValidationPipe())
	const config = await get(ConfigService),
		port = config.get<number>('PORT'),
		client = config.get<string>('CLIENT')

	await enableCors({
		origin: [client],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})
	await listen(port, () => console.log(`server start on port ${port}`))
}
bootstrap()
