<template>
  <div class="login-page">
    <h1>Вход</h1>
    <p>Страница входа в приложение</p>
    <p v-if="message">{{ message }}</p>
    <p v-if="error">{{ error }}</p>
    <form @submit.prevent="submitLogin">
      <div>
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" autocomplete="email" />
      </div>
      <div>
        <label for="password">Пароль</label>
        <input id="password" v-model="form.password" type="password" autocomplete="current-password" />
      </div>
      <button type="submit" :disabled="loading">{{ loading ? 'Входим...' : 'Войти' }}</button>
    </form>
    <div class="button-group">
      <RouterLink to="/" class="btn btn-secondary">На главную</RouterLink>
      <RouterLink to="/register" class="btn btn-primary">Нет аккаунта? Зарегистрируйтесь</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'

import { authService } from '../../api/authService'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
	email: '',
	password: '',
})

const loading = ref(false)
const error = ref('')
const message = ref('')

const submitLogin = async (): Promise<void> => {
	loading.value = true
	error.value = ''
	message.value = ''

	try {
		const response = await authService.login(form)
    authStore.syncAuthState()
		message.value = response.message
		await router.push('/events')
	} catch {
		error.value = 'Не удалось войти'
	} finally {
		loading.value = false
	}
}
</script>