import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { GlobalController } from './global.controller'
import { GlobalService } from './global.service'

@Module({
	controllers: [GlobalController],
	providers: [GlobalService, PrismaService],
	exports: [GlobalService]
})
export class GlobalModule {}
