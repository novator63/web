const getAdminEmails = (): string[] => {
	const raw = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? ''
	return raw
		.split(',')
		.map((email) => email.trim().toLowerCase())
		.filter(Boolean)
}

export const isAdminEmail = (email?: string | null): boolean => {
	if (!email) return false
	return getAdminEmails().includes(email.toLowerCase())
}
