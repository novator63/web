import apiClient from './axios'
import { clearToken, setToken } from '../utils/token'

export interface LoginPayload {
	email: string
	password: string
}

export interface RegisterPayload {
	name: string
	email: string
	password: string
}

export interface AuthResponse {
	message: string
	token: string
}

export interface MessageResponse {
	message: string
}

export const authService = {
	async login(payload: LoginPayload): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>('api/auth/login', payload)
		setToken(response.data.token)
		return response.data
	},
	async register(payload: RegisterPayload): Promise<MessageResponse> {
		const response = await apiClient.post<MessageResponse>('api/auth/register', payload)
		return response.data
	},
	async logout(): Promise<MessageResponse> {
		try {
			const response = await apiClient.post<MessageResponse>('api/auth/logout')
			return response.data
		} finally {
			clearToken()
		}
	},
}
