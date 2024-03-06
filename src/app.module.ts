import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { KeyModule } from './key/key.module';
import { GlobalModule } from './global/global.module';

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, UserModule, ProductModule, KeyModule, GlobalModule],
	controllers: [],
	providers: []
})
export class AppModule {}
