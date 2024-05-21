import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './utils/http-expection.filter'
import { EmojiLogger } from './utils/logger-emoj.logger'

async function bootstrap() {
	const {
		listen,
		enableCors,
		get,
		useGlobalPipes,
		setGlobalPrefix,
		useGlobalFilters,
		use,
		disable
	} = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: new EmojiLogger()
	})

	const logger = new Logger(),
		config = await get(ConfigService),
		port = config.get<number>('PORT'),
		client = config.get<string>('CLIENT'),
		nodeEnv = config.get<string>('NODE_ENV'),
		host = config.get<string>('HOST'),
		isDev = nodeEnv === 'development'

	!isDev && (await useGlobalFilters(new HttpExceptionFilter()))

	await disable('x-powered-by')
	await setGlobalPrefix('api')
	await useGlobalPipes(new ValidationPipe())
	await use(cookieParser())
	await enableCors({
		origin: [client, `http://${host}`],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	if (!port) {
		logger.error('Нету порта!')
		return
	}
	await listen(port, () => {
		isDev
			? logger.log(`+ Сервер запущен на ${port} порту, CORS: ${client}`)
			: logger.log('+ Сервер запущен')
	})
}
bootstrap()
