<template>
	<div :class="$style.root">
		<EventCard
			v-for="event in events"
			:key="event.id"
			:event="event"
			:can-delete="currentUserId !== null && event.createdBy === currentUserId"
			:deleting="deletingId === event.id"
			@delete="$emit('delete', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import EventCard from './EventCard.vue'
import type { EventItem } from '../../../types/event'

defineProps<{ events: EventItem[]; currentUserId: number | null; deletingId: number | null }>()

defineEmits<{ delete: [id: number] }>()
</script>

<style module lang="scss" src="./EventList.module.scss" />
