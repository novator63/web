export interface User {
	id: number
	email: string
	name: string
}

export interface RegisteredUser extends User {
	password: string | null
	createdAt?: string
}
