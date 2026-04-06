<template>
	<form :class="$style.form" @submit.prevent="submitRegister">
		<ErrorMessage v-if="success" :message="success" />
		<ErrorMessage v-if="error" :code="error.code" :message="error.message" />
		<div :class="$style.fields">
			<BaseInput
				v-model="form.lastName"
				label="Фамилия"
				autocomplete="family-name"
				placeholder="Иванов"
				:error="fieldErrors.lastName"
			/>
			<BaseInput
				v-model="form.firstName"
				label="Имя"
				autocomplete="given-name"
				placeholder="Иван"
				:error="fieldErrors.firstName"
			/>
			<BaseInput
				v-model="form.middleName"
				label="Отчество (необязательно)"
				autocomplete="additional-name"
				placeholder="Иванович"
				:error="fieldErrors.middleName"
			/>
			<label :class="$style.selectField">
				<span :class="$style.selectLabel">Пол</span>
				<select
					v-model="form.gender"
					:class="[$style.select, fieldErrors.gender ? $style.selectInvalid : undefined]"
				>
					<option value="male">Мужской</option>
					<option value="female">Женский</option>
				</select>
				<span v-if="fieldErrors.gender" :class="$style.fieldError">{{ fieldErrors.gender }}</span>
			</label>
			<BaseInput
				v-model="form.birthDate"
				label="Дата рождения"
				type="date"
				autocomplete="bday"
				:error="fieldErrors.birthDate"
			/>
			<BaseInput
				v-model="form.email"
				label="Email"
				type="email"
				autocomplete="email"
				placeholder="name@example.com"
				:error="fieldErrors.email"
			/>
			<BaseInput
				v-model="form.password"
				label="Пароль"
				type="password"
				autocomplete="new-password"
				placeholder="••••••••"
				:error="fieldErrors.password"
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
import type { UserGender } from '../../../types/user'
import { getErrorMessage } from '../../../utils/getErrorMessage'

const router = useRouter()

const form = reactive({
	firstName: '',
	lastName: '',
	middleName: '',
	gender: 'male' as UserGender,
	birthDate: '',
	email: '',
	password: '',
})

const loading = ref(false)
const error = ref<{ code?: number; message: string } | null>(null)
const success = ref('')

const fieldErrors = reactive({
	firstName: '',
	lastName: '',
	middleName: '',
	gender: '',
	birthDate: '',
	email: '',
	password: '',
})

const clearFieldErrors = (): void => {
	fieldErrors.firstName = ''
	fieldErrors.lastName = ''
	fieldErrors.middleName = ''
	fieldErrors.gender = ''
	fieldErrors.birthDate = ''
	fieldErrors.email = ''
	fieldErrors.password = ''
}

const validateForm = (): string | null => {
	clearFieldErrors()

	const firstName = form.firstName.trim()
	const lastName = form.lastName.trim()
	const middleName = form.middleName.trim()
	const email = form.email.trim()
	const password = form.password
	const birthDate = form.birthDate

	if (!firstName) fieldErrors.firstName = 'Обязательное поле'
	if (!lastName) fieldErrors.lastName = 'Обязательное поле'
	if (!birthDate) fieldErrors.birthDate = 'Обязательное поле'
	if (!email) fieldErrors.email = 'Обязательное поле'
	if (!password) fieldErrors.password = 'Обязательное поле'
	if (!form.gender) fieldErrors.gender = 'Обязательное поле'

	if (
		fieldErrors.firstName ||
		fieldErrors.lastName ||
		fieldErrors.birthDate ||
		fieldErrors.email ||
		fieldErrors.password ||
		fieldErrors.gender
	) {
		return 'Заполните все обязательные поля'
	}

	const minLength = 2
	const maxLength = 40
	if (firstName.length < minLength || firstName.length > maxLength) {
		fieldErrors.firstName = `От ${minLength} до ${maxLength} символов`
	}

	if (lastName.length < minLength || lastName.length > maxLength) {
		fieldErrors.lastName = `От ${minLength} до ${maxLength} символов`
	}

	if (middleName && (middleName.length < minLength || middleName.length > maxLength)) {
		fieldErrors.middleName = `От ${minLength} до ${maxLength} символов`
	}

	const parsedDate = new Date(birthDate)
	const minDate = new Date('1900-01-01')
	if (Number.isNaN(parsedDate.getTime()) || parsedDate < minDate || parsedDate > new Date()) {
		fieldErrors.birthDate = 'Укажите корректную дату'
	}

	if (
		fieldErrors.firstName ||
		fieldErrors.lastName ||
		fieldErrors.middleName ||
		fieldErrors.birthDate
	) {
		return 'Проверьте заполнение полей'
	}

	return null
}

const submitRegister = async (): Promise<void> => {
	loading.value = true
	error.value = null
	success.value = ''
	clearFieldErrors()

	const validationError = validateForm()
	if (validationError) {
		error.value = { message: validationError }
		loading.value = false
		return
	}

	try {
		const response = await authService.register({
			firstName: form.firstName.trim(),
			lastName: form.lastName.trim(),
			middleName: form.middleName.trim() || undefined,
			gender: form.gender,
			birthDate: form.birthDate,
			email: form.email.trim(),
			password: form.password,
		})
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

.selectField {
	display: grid;
	gap: 6px;
}

.selectLabel {
	font-size: 13px;
	font-weight: 600;
	color: #62626a;
}

.select {
	padding: 10px 12px;
	border-radius: 10px;
	border: 1px solid rgba(55, 55, 60, 0.18);
	background: #fff;
	color: #1f1f26;
}

.selectInvalid {
	border-color: rgba(164, 65, 65, 0.55);
}

.fieldError {
	font-size: 13px;
	color: rgba(164, 65, 65, 0.95);
}

.actions {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}
</style>
