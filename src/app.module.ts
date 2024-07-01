import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { GlobalModule } from './global/global.module'
import { KeyModule } from './key/key.module'
import { ProductModule } from './product/product.module'
import { UserModule } from './user/user.module'
import { ApiModule } from './api/api.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: './.env'
		}),
		CacheModule.register({ isGlobal: true }),
		AuthModule,
		UserModule,
		ProductModule,
		KeyModule,
		GlobalModule,
		ApiModule
	]
})
export class AppModule {}
