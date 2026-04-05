<template>
	<div :class="$style.root">
		<h1 :class="$style.title">События</h1>
		<div :class="$style.actions">
			<BaseInput
				id="events-search"
				placeholder="Поиск по названию и описанию"
				:model-value="search"
				@update:model-value="$emit('update:search', $event)"
			/>
			<BaseButton variant="ghost" :disabled="loading" @click="$emit('update:search', '')">
				Очистить
			</BaseButton>
			<BaseButton variant="secondary" :disabled="loading" @click="$emit('refresh')">
				{{ loading ? 'Загрузка…' : 'Обновить' }}
			</BaseButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import BaseButton from '../../../components/ui/BaseButton/BaseButton.vue'
import BaseInput from '../../../components/ui/BaseInput/BaseInput.vue'

defineProps<{
	loading: boolean
	search: string
}>()

defineEmits<{
	refresh: []
	'update:search': [value: string]
}>()
</script>

<style module lang="scss" src="./EventsToolbar.module.scss" />
