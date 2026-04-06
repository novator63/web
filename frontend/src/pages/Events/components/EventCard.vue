<template>
	<article :class="$style.root">
		<div :class="$style.header">
			<h3 :class="$style.title">{{ event.title }}</h3>
			<div :class="$style.meta">{{ formattedDate }}</div>
		</div>
		<div :class="$style.category">{{ categoryLabel }}</div>
		<p v-if="event.description" :class="$style.desc">{{ event.description }}</p>
		<div v-if="canEdit || canDelete" :class="$style.actions">
			<BaseButton v-if="canEdit" variant="ghost" :disabled="deleting" @click="$emit('edit', event)">
				Редактировать
			</BaseButton>
			<BaseButton
				v-if="canDelete"
				variant="secondary"
				:disabled="deleting"
				@click="$emit('delete', event.id)"
			>
				{{ deleting ? 'Удаляем…' : 'Удалить' }}
			</BaseButton>
		</div>
	</article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import BaseButton from '../../../components/ui/BaseButton/BaseButton.vue'
import type { EventItem } from '../../../types/event'
import { formatDate } from '../../../utils/formatDate'

const props = defineProps<{
	event: EventItem
	canDelete: boolean
	canEdit: boolean
	deleting?: boolean
}>()

defineEmits<{ delete: [id: number]; edit: [event: EventItem] }>()

const formattedDate = computed(() => formatDate(props.event.date))
const categoryLabel = computed(() => props.event.category)
</script>

<style module lang="scss" src="./EventCard.module.scss" />
