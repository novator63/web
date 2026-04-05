<template>
	<form :class="$style.form" @submit.prevent="submitLogin">
		<ErrorMessage v-if="error" :code="error.code" :message="error.message" />
		<div :class="$style.fields">
			<BaseInput
				v-model="form.email"
				label="Email"
				type="email"
				autocomplete="email"
				placeholder="name@example.com"
			/>
			<BaseInput
				v-model="form.password"
				label="Пароль"
				type="password"
				autocomplete="current-password"
				placeholder="••••••••"
			/>
		</div>
		<div :class="$style.actions">
			<BaseButton type="submit" :disabled="loading">{{ loading ? 'Входим…' : 'Войти' }}</BaseButton>
			<BaseButton to="/" variant="secondary">На главную</BaseButton>
			<BaseButton to="/register" variant="ghost">Регистрация</BaseButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { authService } from '../../../api/authService'
import BaseButton from '../../../components/ui/BaseButton/BaseButton.vue'
import BaseInput from '../../../components/ui/BaseInput/BaseInput.vue'
import ErrorMessage from '../../../components/ui/ErrorMessage/ErrorMessage.vue'
import { useAuthStore } from '../../../stores/authStore'
import { getErrorMessage } from '../../../utils/getErrorMessage'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
	email: '',
	password: '',
})

const loading = ref(false)
const error = ref<{ code?: number; message: string } | null>(null)

const submitLogin = async (): Promise<void> => {
	loading.value = true
	error.value = null

	try {
		await authService.login(form)
		authStore.syncAuthState()
		await router.push('/events')
	} catch (e) {
		error.value = getErrorMessage(e, 'Не удалось войти')
	} finally {
		loading.value = false
	}
}
</script>

<style module lang="scss">
.form {
	display: grid;
	gap: 14px;
}

.fields {
	display: grid;
	gap: 12px;
}

.actions {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}
</style>
