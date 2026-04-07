import { defineStore } from 'pinia'

import { userService } from '../api/userService'
import type { RegisteredUser } from '../types/user'
import { getErrorMessage } from '../utils/getErrorMessage'

interface UsersState {
	users: RegisteredUser[]
	loading: boolean
	error: string
}

export const useUsersStore = defineStore('users', {
	state: (): UsersState => ({
		users: [],
		loading: false,
		error: '',
	}),
	actions: {
		async loadUsers(): Promise<void> {
			this.loading = true
			this.error = ''

			try {
				this.users = await userService.getAllUsers()
			} catch (e) {
				this.error = getErrorMessage(e, 'Не удалось загрузить пользователей').message
			} finally {
				this.loading = false
			}
		},
	},
})
