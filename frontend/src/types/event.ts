export interface EventItem {
	id: number
	title: string
	description: string | null
	date: string
	category: string
	createdBy?: number
	createdAt?: string
	updatedAt?: string
}

export interface EventPayload {
	title: string
	description?: string | null
	date: string
	category: string
}
