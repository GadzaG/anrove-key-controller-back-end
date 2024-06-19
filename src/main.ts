import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './utils/http-expection.filter'
import { EmojiLogger } from './utils/logger-emoj.logger'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
			logger: new EmojiLogger()
		}),
		logger = new Logger(),
		config = await app.get(ConfigService),
		port = config.get<number>('PORT'),
		client = config.get<string>('CLIENT'),
		nodeEnv = config.get<string>('NODE_ENV'),
		domain = config.get<string>('DOMAIN'),
		isDev = nodeEnv === 'development'

	await app.useGlobalFilters(new HttpExceptionFilter())

	await app.disable('x-powered-by')
	await app.setGlobalPrefix('api')
	await app.useGlobalPipes(new ValidationPipe())
	await app.use(cookieParser())
	await app.enableCors({
		origin: [client, `http://${domain}`],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	if (!port) {
		logger.error('Нету порта!')
		return
	}
	await app.listen(port, () => {
		isDev
			? logger.log(`+ Сервер запущен на ${port} порту, CORS: ${client}`)
			: logger.log('+ Сервер запущен')
	})
}
bootstrap()
