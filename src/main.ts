import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { EmojiLogger, listenerColorize } from './utils/logger-emoj.logger'

async function bootstrap() {
	const {
			disable,
			useGlobalPipes,
			use,
			enableCors,
			listen,
			get,
			setGlobalPrefix,
			useGlobalFilters
		} = await NestFactory.create<NestExpressApplication>(AppModule, {
			logger: new EmojiLogger()
		}),
		logger = new Logger(),
		config = await get(ConfigService),
		port = config.get<number>('PORT'),
		client = config.get<string>('CLIENT')

	disable('x-powered-by')
	setGlobalPrefix('api')
	useGlobalPipes(new ValidationPipe())
	use(cookieParser())
	use(compression())

	enableCors({
		origin: [client],
		credentials: true,
		exposedHeaders: 'set-cookie'
	})

	await listen(port, () => {
		logger.log(listenerColorize(`🚀 Server running on port ${port}`))
	})
}
bootstrap()
