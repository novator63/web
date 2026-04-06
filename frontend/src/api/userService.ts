import apiClient from './axios'

import type { RegisteredUser, UpdateProfilePayload, User } from '../types/user'

export const userService = {
	async getAllUsers(): Promise<RegisteredUser[]> {
		const response = await apiClient.get<RegisteredUser[]>('/api/users')
		return response.data
	},
	async getMyProfile(): Promise<User> {
		const response = await apiClient.get<User>('/api/users/me')
		return response.data
	},
	async updateMyProfile(payload: UpdateProfilePayload): Promise<User> {
		const response = await apiClient.patch<User>('/api/users/me', payload)
		return response.data
	},
}
