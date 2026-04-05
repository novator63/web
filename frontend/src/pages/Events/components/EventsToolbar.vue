<template>
	<div :class="$style.root">
		<h1 :class="$style.title">События</h1>
		<div :class="$style.actions">
			<BaseButton variant="secondary" :disabled="loading" @click="$emit('refresh')">
				{{ loading ? 'Загрузка…' : 'Обновить' }}
			</BaseButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import BaseButton from '../../../components/ui/BaseButton/BaseButton.vue'

defineProps<{ loading: boolean }>()

defineEmits<{ refresh: [] }>()
</script>

<style module lang="scss" src="./EventsToolbar.module.scss" />
