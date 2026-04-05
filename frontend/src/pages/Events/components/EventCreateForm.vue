<template>
	<form :class="$style.root" @submit.prevent="handleSubmit">
		<div :class="$style.fields">
			<BaseInput
				v-model="title"
				label="Название"
				placeholder="Например: Митап"
				:disabled="disabled"
			/>
			<BaseInput
				v-model="description"
				label="Описание"
				placeholder="Коротко о событии"
				:disabled="disabled"
			/>
			<BaseInput v-model="date" label="Дата" type="datetime-local" :disabled="disabled" />
		</div>
		<div :class="$style.actions">
			<BaseButton type="submit" :disabled="disabled || !canSubmit">Создать</BaseButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import BaseButton from '../../../components/ui/BaseButton/BaseButton.vue'
import BaseInput from '../../../components/ui/BaseInput/BaseInput.vue'
import type { EventPayload } from '../../../types/event'

const props = withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })

const emit = defineEmits<{ submit: [payload: EventPayload] }>()

const title = ref('')
const description = ref('')
const date = ref('')

const canSubmit = computed(() => title.value.trim().length > 0 && date.value.trim().length > 0)

const handleSubmit = (): void => {
	if (!canSubmit.value) return

	emit('submit', {
		title: title.value.trim(),
		description: description.value.trim() ? description.value.trim() : null,
		date: new Date(date.value).toISOString(),
	})

	title.value = ''
	description.value = ''
	date.value = ''
}
</script>

<style module lang="scss" src="./EventCreateForm.module.scss" />
