<template>
	<header :class="$style.root">
		<AppContainer>
			<div :class="$style.inner">
				<RouterLink to="/" :class="$style.brand">
					<img :src="logoUrl" alt="TM" :class="$style.logo" />
					<span :class="$style.brandText">TM</span>
				</RouterLink>

				<button
					type="button"
					:class="$style.burger"
					:aria-expanded="isMenuOpen"
					aria-controls="header-menu"
					aria-label="Открыть меню"
					@click="toggleMenu"
				>
					<span :class="$style.burgerLine" />
					<span :class="$style.burgerLine" />
					<span :class="$style.burgerLine" />
				</button>

				<nav id="header-menu" :class="[$style.nav, { [$style.navOpen]: isMenuOpen }]">
					<RouterLink to="/" :class="$style.link" @click="closeMenu">Главная</RouterLink>
					<RouterLink to="/events" :class="$style.link" @click="closeMenu">События</RouterLink>
					<RouterLink
						v-if="authStore.isAuthenticated && authStore.isAdmin"
						to="/users"
						:class="$style.link"
						@click="closeMenu"
					>
						Пользователи
					</RouterLink>

					<div v-if="!authStore.isAuthenticated" :class="$style.actions">
						<BaseButton variant="ghost" to="/login" @click="closeMenu">Вход</BaseButton>
						<BaseButton variant="primary" to="/register" @click="closeMenu">Регистрация</BaseButton>
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
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import logoUrl from '../../../assets/images/logo.svg'
import { useAuthStore } from '../../../stores/authStore'
import BaseButton from '../../ui/BaseButton/BaseButton.vue'
import AppContainer from '../AppContainer/AppContainer.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const isMenuOpen = ref(false)

onMounted(() => {
	authStore.syncAuthState()
})

watch(
	() => route.fullPath,
	() => {
		isMenuOpen.value = false
	},
)

const toggleMenu = (): void => {
	isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = (): void => {
	isMenuOpen.value = false
}

const handleLogout = async (): Promise<void> => {
	closeMenu()

	try {
		await authStore.logout()
	} finally {
		await router.push('/login')
	}
}
</script>

<style module lang="scss" src="./AppHeader.module.scss" />
