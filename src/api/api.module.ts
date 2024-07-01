import { Module } from '@nestjs/common'
import { GlobalService } from 'src/global/global.service'
import { KeyService } from 'src/key/key.service'
import { ApiController } from './api.controller'
import { ApiService } from './api.service'

@Module({
	controllers: [ApiController],
	providers: [ApiService, GlobalService, KeyService]
})
export class ApiModule {}
