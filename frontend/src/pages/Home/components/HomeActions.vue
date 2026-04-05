<template>
	<section :class="$style.root">
		<template v-if="!authStore.isAuthenticated">
			<BaseButton to="/login" variant="secondary">Авторизация</BaseButton>
			<BaseButton to="/register" variant="primary">Регистрация</BaseButton>
		</template>
		<template v-else>
			<BaseButton to="/events" variant="primary">Список мероприятий</BaseButton>
			<BaseButton variant="secondary" :disabled="authStore.isLoggingOut" @click="handleLogout">
				{{ authStore.isLoggingOut ? 'Выходим…' : 'Выйти' }}
			</BaseButton>
		</template>
	</section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import BaseButton from '../../../components/ui/BaseButton/BaseButton.vue'
import { useAuthStore } from '../../../stores/authStore'

const authStore = useAuthStore()

onMounted(() => {
	authStore.syncAuthState()
})

const handleLogout = async (): Promise<void> => {
	await authStore.logout()
}
</script>

<style module lang="scss">
.root {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}
</style>
