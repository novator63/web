<template>
	<form :class="$style.form" @submit.prevent="submitRegister">
		<ErrorMessage v-if="success" :message="success" />
		<ErrorMessage v-if="error" :code="error.code" :message="error.message" />
		<div :class="$style.fields">
			<BaseInput v-model="form.name" label="Имя" autocomplete="name" placeholder="Ваше имя" />
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
				autocomplete="new-password"
				placeholder="••••••••"
			/>
		</div>
		<div :class="$style.actions">
			<BaseButton type="submit" :disabled="loading">{{
				loading ? 'Создаём…' : 'Зарегистрироваться'
			}}</BaseButton>
			<BaseButton to="/" variant="secondary">На главную</BaseButton>
			<BaseButton to="/login" variant="ghost">Уже есть аккаунт</BaseButton>
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
import { getErrorMessage } from '../../../utils/getErrorMessage'

const router = useRouter()

const form = reactive({
	name: '',
	email: '',
	password: '',
})

const loading = ref(false)
const error = ref<{ code?: number; message: string } | null>(null)
const success = ref('')

const submitRegister = async (): Promise<void> => {
	loading.value = true
	error.value = null
	success.value = ''

	try {
		const response = await authService.register(form)
		success.value = response.message
		await router.push('/login')
	} catch (e) {
		error.value = getErrorMessage(e, 'Не удалось зарегистрироваться')
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
