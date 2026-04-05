import apiClient from './axios'

import type { RegisteredUser } from '../types/user'

export const userService = {
	async getAllUsers(): Promise<RegisteredUser[]> {
		const response = await apiClient.get<RegisteredUser[]>('/api/users')
		return response.data
	},
}
