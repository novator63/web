import type { User } from './user'

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

export interface AuthTokenPayload extends User {
	iat?: number
	exp?: number
}
