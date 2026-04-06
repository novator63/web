<template>
	<div :class="$style.root">
		<section :class="$style.card">
			<div :class="$style.profileHeader">
				<h1 :class="$style.title">Профиль</h1>
				<BaseButton
					v-if="!isEditing"
					variant="secondary"
					:disabled="profileLoading"
					@click="startEditing"
				>
					Редактировать
				</BaseButton>
			</div>

			<ErrorMessage v-if="profileSuccess" :message="profileSuccess" />
			<ErrorMessage v-if="profileError" :code="profileError.code" :message="profileError.message" />

			<div v-if="!isEditing" :class="$style.userInfo">
				<div :class="$style.row">
					<span :class="$style.label">Фамилия</span>
					<span>{{ authStore.user?.lastName ?? '—' }}</span>
				</div>
				<div :class="$style.row">
					<span :class="$style.label">Имя</span>
					<span>{{ authStore.user?.firstName ?? '—' }}</span>
				</div>
				<div :class="$style.row">
					<span :class="$style.label">Отчество</span>
					<span>{{ authStore.user?.middleName ?? '—' }}</span>
				</div>
				<div :class="$style.row">
					<span :class="$style.label">Пол</span>
					<span>{{ formatGender(authStore.user?.gender) }}</span>
				</div>
				<div :class="$style.row">
					<span :class="$style.label">Дата рождения</span>
					<span>{{ formatBirthDate(authStore.user?.birthDate) }}</span>
				</div>
				<div :class="$style.row">
					<span :class="$style.label">Email</span>
					<span>{{ authStore.user?.email ?? '—' }}</span>
				</div>
			</div>

			<form v-else :class="$style.profileForm" @submit.prevent="submitProfile">
				<div :class="$style.userInfo">
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

					<div :class="$style.row">
						<span :class="$style.label">Email</span>
						<span>{{ authStore.user?.email ?? '—' }}</span>
					</div>
				</div>

				<div :class="$style.profileActions">
					<BaseButton type="submit" :disabled="profileLoading || profileSaving">
						{{ profileSaving ? 'Сохраняем…' : 'Сохранить профиль' }}
					</BaseButton>
					<BaseButton
						type="button"
						variant="ghost"
						:disabled="profileSaving"
						@click="cancelEditing"
					>
						Отмена
					</BaseButton>
				</div>
			</form>
		</section>

		<section :class="$style.card">
			<div :class="$style.eventsHeader">
				<h2 :class="$style.subtitle">Мои мероприятия</h2>
			</div>

			<div v-if="loading" :class="$style.state">Загрузка…</div>
			<ErrorMessage v-else-if="error" :code="error.code" :message="error.message" />
			<div v-else-if="visibleEvents.length === 0" :class="$style.state">
				Вы ещё не создали ни одного мероприятия.
			</div>
			<EventList v-else :events="visibleEvents" :current-user-id="null" :deleting-id="null" />
		</section>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { eventService } from '../../api/eventService'
import { userService } from '../../api/userService'
import BaseButton from '../../components/ui/BaseButton/BaseButton.vue'
import BaseInput from '../../components/ui/BaseInput/BaseInput.vue'
import ErrorMessage from '../../components/ui/ErrorMessage/ErrorMessage.vue'
import { useAuthStore } from '../../stores/authStore'
import type { UiError } from '../../types/api'
import type { EventItem } from '../../types/event'
import type { UserGender } from '../../types/user'
import { getErrorMessage } from '../../utils/getErrorMessage'
import EventList from '../Events/components/EventList.vue'

const authStore = useAuthStore()

const events = ref<EventItem[]>([])
const loading = ref(false)
const error = ref<UiError | null>(null)

const profileLoading = ref(false)
const profileSaving = ref(false)
const profileError = ref<UiError | null>(null)
const profileSuccess = ref('')
const isEditing = ref(false)

const form = reactive({
	firstName: '',
	lastName: '',
	middleName: '',
	gender: 'male' as UserGender,
	birthDate: '',
})

const fieldErrors = reactive({
	firstName: '',
	lastName: '',
	middleName: '',
	gender: '',
	birthDate: '',
})

const visibleEvents = computed(() => {
	const currentUserId = authStore.user?.id
	if (!currentUserId) {
		return []
	}

	return events.value.filter((event) => event.createdBy === currentUserId)
})

const loadEvents = async (): Promise<void> => {
	loading.value = true
	error.value = null

	try {
		events.value = await eventService.getEvents()
	} catch (e) {
		error.value = getErrorMessage(e, 'Не удалось загрузить мероприятия')
	} finally {
		loading.value = false
	}
}

const setFormFromStore = (): void => {
	const user = authStore.user
	if (!user) return

	form.firstName = user.firstName
	form.lastName = user.lastName
	form.middleName = user.middleName ?? ''
	form.gender = user.gender
	form.birthDate = user.birthDate
}

const clearFieldErrors = (): void => {
	fieldErrors.firstName = ''
	fieldErrors.lastName = ''
	fieldErrors.middleName = ''
	fieldErrors.gender = ''
	fieldErrors.birthDate = ''
}

const formatGender = (value?: string): string => {
	if (value === 'male') return 'Мужской'
	if (value === 'female') return 'Женский'
	return '—'
}

const formatBirthDate = (value?: string): string => {
	if (!value) return '—'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return '—'
	return date.toLocaleDateString('ru-RU')
}

const startEditing = (): void => {
	profileError.value = null
	profileSuccess.value = ''
	clearFieldErrors()
	setFormFromStore()
	isEditing.value = true
}

const cancelEditing = (): void => {
	clearFieldErrors()
	setFormFromStore()
	isEditing.value = false
}

const validateProfileForm = (): string | null => {
	clearFieldErrors()

	const firstName = form.firstName.trim()
	const lastName = form.lastName.trim()
	const middleName = form.middleName.trim()

	if (!firstName) fieldErrors.firstName = 'Обязательное поле'
	if (!lastName) fieldErrors.lastName = 'Обязательное поле'
	if (!form.birthDate) fieldErrors.birthDate = 'Обязательное поле'
	if (!form.gender) fieldErrors.gender = 'Обязательное поле'

	if (
		fieldErrors.firstName ||
		fieldErrors.lastName ||
		fieldErrors.birthDate ||
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

	const parsedDate = new Date(form.birthDate)
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

const loadProfile = async (): Promise<void> => {
	profileLoading.value = true
	profileError.value = null

	try {
		const profile = await userService.getMyProfile()
		authStore.setUser(profile)
		setFormFromStore()
	} catch (e) {
		profileError.value = getErrorMessage(e, 'Не удалось загрузить профиль')
	} finally {
		profileLoading.value = false
	}
}

const submitProfile = async (): Promise<void> => {
	profileError.value = null
	profileSuccess.value = ''

	const validationError = validateProfileForm()
	if (validationError) {
		profileError.value = { message: validationError }
		return
	}

	profileSaving.value = true

	try {
		const updatedProfile = await userService.updateMyProfile({
			firstName: form.firstName.trim(),
			lastName: form.lastName.trim(),
			middleName: form.middleName.trim() || undefined,
			gender: form.gender,
			birthDate: form.birthDate,
		})
		authStore.setUser(updatedProfile)
		setFormFromStore()
		profileSuccess.value = 'Профиль успешно обновлён'
		isEditing.value = false
	} catch (e) {
		profileError.value = getErrorMessage(e, 'Не удалось обновить профиль')
	} finally {
		profileSaving.value = false
	}
}

onMounted(() => {
	authStore.syncAuthState()
	setFormFromStore()
	void loadProfile()
	void loadEvents()
})
</script>

<style module lang="scss" src="./ProfilePage.module.scss" />
