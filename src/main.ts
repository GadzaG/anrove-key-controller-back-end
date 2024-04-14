import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.use(cookieParser())
	const config = await app.get(ConfigService),
		port = config.get<number>('PORT'),
		client = config.get<string>('CLIENT')
	app.enableCors({
		origin: [client],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})
	await app.listen(port, () => console.log(`server start on port ${port}`))
}
bootstrap()
