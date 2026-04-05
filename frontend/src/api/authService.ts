import apiClient from './axios'

import type { AuthResponse, LoginPayload, MessageResponse, RegisterPayload } from '../types/auth'
import { clearToken, setToken } from '../utils/token'

export const authService = {
	async login(payload: LoginPayload): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>('/api/auth/login', payload)
		setToken(response.data.token)
		return response.data
	},
	async register(payload: RegisterPayload): Promise<MessageResponse> {
		const response = await apiClient.post<MessageResponse>('/api/auth/register', payload)
		return response.data
	},
	async logout(): Promise<MessageResponse> {
		try {
			const response = await apiClient.post<MessageResponse>('/api/auth/logout')
			return response.data
		} finally {
			clearToken()
		}
	},
}
