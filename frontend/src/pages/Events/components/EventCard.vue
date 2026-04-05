<template>
	<article :class="$style.root">
		<div :class="$style.header">
			<h3 :class="$style.title">{{ event.title }}</h3>
			<div :class="$style.meta">{{ formattedDate }}</div>
		</div>
		<p v-if="event.description" :class="$style.desc">{{ event.description }}</p>
		<div v-if="canDelete" :class="$style.actions">
			<BaseButton variant="secondary" :disabled="deleting" @click="$emit('delete', event.id)">
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

const props = defineProps<{ event: EventItem; canDelete: boolean; deleting?: boolean }>()

defineEmits<{ delete: [id: number] }>()

const formattedDate = computed(() => formatDate(props.event.date))
</script>

<style module lang="scss" src="./EventCard.module.scss" />
