import type { User, UserGender } from './user'

export interface LoginPayload {
	email: string
	password: string
}

export interface RegisterPayload {
	firstName: string
	lastName: string
	middleName?: string
	gender: UserGender
	birthDate: string
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
