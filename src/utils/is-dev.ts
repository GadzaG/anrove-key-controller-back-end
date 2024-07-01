import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'
dotenv.config()
export enum ModeDev {
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
	TEST = 'test',
}
export const isDev = (configService: ConfigService): boolean =>
	configService.get<string>('NODE_ENV') === ModeDev.DEVELOPMENT
export const isTest = (configService: ConfigService): boolean =>
	configService.get<string>('NODE_ENV') === ModeDev.TEST

export const IS_DEV_ENV: boolean = process.env.NODE_ENV === ModeDev.DEVELOPMENT
export const IS_TEST_ENV: boolean = process.env.NODE_ENV === ModeDev.TEST
