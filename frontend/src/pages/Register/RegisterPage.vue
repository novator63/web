<template>
  <div class="register-page">
    <h1>Регистрация</h1>
    <p>Создайте новый аккаунт</p>
    <p v-if="message">{{ message }}</p>
    <p v-if="error">{{ error }}</p>
    <form @submit.prevent="submitRegister">
      <div>
        <label for="name">Имя</label>
        <input id="name" v-model="form.name" type="text" autocomplete="name" />
      </div>
      <div>
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" autocomplete="email" />
      </div>
      <div>
        <label for="password">Пароль</label>
        <input id="password" v-model="form.password" type="password" autocomplete="new-password" />
      </div>
      <button type="submit" :disabled="loading">{{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}</button>
    </form>
    <div class="button-group">
      <RouterLink to="/" class="btn btn-secondary">На главную</RouterLink>
      <RouterLink to="/login" class="btn btn-primary">Уже есть аккаунт? Войдите</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'

import { authService } from '../../api/authService'

const router = useRouter()

const form = reactive({
	name: '',
	email: '',
	password: '',
})

const loading = ref(false)
const error = ref('')
const message = ref('')

const submitRegister = async (): Promise<void> => {
	loading.value = true
	error.value = ''
	message.value = ''

	try {
		const response = await authService.register(form)
		message.value = response.message
		await router.push('/login')
	} catch {
		error.value = 'Не удалось зарегистрироваться'
	} finally {
		loading.value = false
	}
}
</script>