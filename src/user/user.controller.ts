import { Controller, Delete, Get, Put } from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@Get('profile')
	async getProfile(@CurrentUser('id') id: string) {
		return await this.userService.getById(id)
	}
	@Auth('ADMIN')
	@Get()
	async getList() {
		return await this.userService.getUsers()
	}
	@Auth('ADMIN')
	@Delete('delete')
	async deleteUser() {
		return await this.userService.deleteUser()
	}
	@Auth()
	@Put('switch')
	async switchRole(@CurrentUser('id') id: string) {
		return await this.userService.switchRole(id)
	}
}
