<template>
	<div v-if="message" :class="$style.root" role="alert">
		<div v-if="code !== undefined && code !== null" :class="$style.code">{{ code }}</div>
		<div :class="$style.message">{{ message }}</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		code?: number | string
		message: string
	}>(),
	{},
)
</script>

<style module lang="scss" src="./ErrorMessage.module.scss" />
