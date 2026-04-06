<template>
	<form :class="$style.root" @submit.prevent="handleSubmit">
		<div :class="$style.fields">
			<BaseInput
				v-model="title"
				label="Название"
				placeholder="Например: Митап"
				:disabled="disabled"
				:error="titleError"
			/>
			<BaseInput
				v-model="category"
				label="Тип мероприятия"
				placeholder="Например: митап"
				:disabled="disabled"
				:error="categoryError"
			/>

			<BaseInput
				v-model="description"
				label="Описание"
				placeholder="Коротко о событии"
				:disabled="disabled"
				:error="descriptionError"
			/>
			<BaseInput
				v-model="date"
				label="Дата"
				type="datetime-local"
				:min="minimumDate"
				:disabled="disabled"
				:error="dateError"
			/>
		</div>
		<div :class="$style.actions">
			<BaseButton v-if="mode === 'edit'" type="button" variant="ghost" :disabled="disabled" @click="$emit('cancel')">
				Отмена
			</BaseButton>
			<BaseButton type="submit" :disabled="disabled || !canSubmit">{{ submitText }}</BaseButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import BaseButton from '../../../components/ui/BaseButton/BaseButton.vue'
import BaseInput from '../../../components/ui/BaseInput/BaseInput.vue'
import type { EventPayload } from '../../../types/event'

type FormMode = 'create' | 'edit'

const props = withDefaults(
	defineProps<{
		disabled?: boolean
		mode?: FormMode
		initialValues?: Partial<EventPayload>
	}>(),
	{ disabled: false, mode: 'create' },
)

const emit = defineEmits<{ submit: [payload: EventPayload]; cancel: [] }>()

const TITLE_MIN_LENGTH = 3
const TITLE_MAX_LENGTH = 80
const DESCRIPTION_MAX_LENGTH = 500
const CATEGORY_MIN_LENGTH = 2
const CATEGORY_MAX_LENGTH = 40

const title = ref('')
const description = ref('')
const date = ref('')
const category = ref('')

const minimumDate = computed(() => toLocalDateTimeInput(new Date()))

const submitText = computed(() => (props.mode === 'edit' ? 'Сохранить' : 'Создать'))

const titleError = computed(() => {
	const trimmed = title.value.trim()
	if (!trimmed.length) return 'Введите название'
	if (trimmed.length < TITLE_MIN_LENGTH) return `Минимум ${TITLE_MIN_LENGTH} символа`
	if (trimmed.length > TITLE_MAX_LENGTH) return `Максимум ${TITLE_MAX_LENGTH} символов`
	return ''
})

const descriptionError = computed(() => {
	if (description.value.trim().length > DESCRIPTION_MAX_LENGTH) {
		return `Максимум ${DESCRIPTION_MAX_LENGTH} символов`
	}
	return ''
})

const categoryError = computed(() => {
	const trimmed = category.value.trim()
	if (!trimmed.length) {
		return 'Введите тип мероприятия'
	}
	if (trimmed.length < CATEGORY_MIN_LENGTH) return `Минимум ${CATEGORY_MIN_LENGTH} символа`
	if (trimmed.length > CATEGORY_MAX_LENGTH) return `Максимум ${CATEGORY_MAX_LENGTH} символов`
	return ''
})

const dateError = computed(() => {
	if (!date.value.trim().length) return 'Выберите дату и время'

	const parsed = new Date(date.value)
	if (Number.isNaN(parsed.getTime())) {
		return 'Некорректная дата'
	}

	if (parsed.getTime() < Date.now()) {
		return 'Дата не может быть в прошлом'
	}

	return ''
})

const canSubmit = computed(
	() => !titleError.value && !descriptionError.value && !dateError.value && !categoryError.value,
)

const toLocalDateTimeInput = (value: Date): string => {
	const offsetMinutes = value.getTimezoneOffset()
	const local = new Date(value.getTime() - offsetMinutes * 60 * 1000)
	return local.toISOString().slice(0, 16)
}

const normalizeDateForInput = (value?: string): string => {
	if (!value) return ''
	const parsed = new Date(value)
	if (Number.isNaN(parsed.getTime())) return ''
	return toLocalDateTimeInput(parsed)
}

const resetForm = (): void => {
	title.value = ''
	description.value = ''
	date.value = ''
	category.value = ''
}

watch(
	() => [props.mode, props.initialValues] as const,
	([mode, initialValues]) => {
		if (mode === 'edit' && initialValues) {
			title.value = initialValues.title ?? ''
			description.value = initialValues.description ?? ''
			date.value = normalizeDateForInput(initialValues.date)
			category.value = initialValues.category ?? ''
			return
		}

		resetForm()
	},
	{ immediate: true },
)

const handleSubmit = (): void => {
	if (!canSubmit.value) return

	const payload: EventPayload = {
		title: title.value.trim(),
		description: description.value.trim() ? description.value.trim() : null,
		date: new Date(date.value).toISOString(),
		category: category.value.trim(),
	}

	emit('submit', payload)

	if (props.mode === 'create') {
		resetForm()
	}
}
</script>

<style module lang="scss" src="./EventCreateForm.module.scss" />
