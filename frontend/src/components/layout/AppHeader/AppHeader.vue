<template>
	<header :class="$style.root">
		<AppContainer>
			<div :class="$style.inner">
				<RouterLink to="/" :class="$style.brand">
					<img :src="logoUrl" alt="TM" :class="$style.logo" />
					<span :class="$style.brandText">TM</span>
				</RouterLink>

				<nav :class="$style.nav">
					<RouterLink to="/" :class="$style.link">Главная</RouterLink>
					<RouterLink to="/events" :class="$style.link">События</RouterLink>

					<div v-if="!authStore.isAuthenticated" :class="$style.actions">
						<BaseButton variant="ghost" to="/login">Вход</BaseButton>
						<BaseButton variant="primary" to="/register">Регистрация</BaseButton>
					</div>

					<div v-else :class="$style.actions">
						<span :class="$style.user">{{ authStore.user?.name ?? 'Пользователь' }}</span>
						<BaseButton
							variant="secondary"
							:disabled="authStore.isLoggingOut"
							@click="handleLogout"
						>
							{{ authStore.isLoggingOut ? 'Выходим…' : 'Выйти' }}
						</BaseButton>
					</div>
				</nav>
			</div>
		</AppContainer>
	</header>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import logoUrl from '../../../assets/images/logo.svg'
import { useAuthStore } from '../../../stores/authStore'
import BaseButton from '../../ui/BaseButton/BaseButton.vue'
import AppContainer from '../AppContainer/AppContainer.vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
	authStore.syncAuthState()
})

const handleLogout = async (): Promise<void> => {
	try {
		await authStore.logout()
	} finally {
		await router.push('/login')
	}
}
</script>

<style module lang="scss" src="./AppHeader.module.scss" />
