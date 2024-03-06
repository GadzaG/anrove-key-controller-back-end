import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { KeyController } from './key.controller'
import { KeyService } from './key.service'

@Module({
	controllers: [KeyController],
	providers: [KeyService, PrismaService],
	exports: [KeyService]
})
export class KeyModule {}
