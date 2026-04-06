export type UserGender = 'male' | 'female'

export interface User {
	id: number
	email: string
	name: string
	firstName: string
	lastName: string
	middleName: string | null
	gender: UserGender
	birthDate: string
}

export interface RegisteredUser extends User {
	password: string | null
	createdAt?: string
}

export interface UpdateProfilePayload {
	firstName: string
	lastName: string
	middleName?: string
	gender: UserGender
	birthDate: string
}
