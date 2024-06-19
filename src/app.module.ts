import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { GlobalModule } from './global/global.module'
import { KeyModule } from './key/key.module'
import { ProductModule } from './product/product.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: './.env'
		}),
		AuthModule,
		UserModule,
		ProductModule,
		KeyModule,
		GlobalModule
	]
})
export class AppModule {}
