<template>
	<label :class="$style.root">
		<span v-if="label" :class="$style.label">{{ label }}</span>
		<input
			:id="id"
			:name="name"
			:type="type"
			:autocomplete="autocomplete"
			:placeholder="placeholder"
			:value="modelValue"
			:disabled="disabled"
			:class="[$style.input, error ? $style.invalid : undefined]"
			:aria-invalid="Boolean(error)"
			v-bind="$attrs"
			@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
		/>
		<span v-if="error" :class="$style.error">{{ error }}</span>
	</label>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
	defineProps<{
		modelValue: string
		label?: string
		id?: string
		name?: string
		type?: string
		autocomplete?: string
		placeholder?: string
		disabled?: boolean
		error?: string
	}>(),
	{
		type: 'text',
		disabled: false,
	},
)

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style module lang="scss" src="./BaseInput.module.scss" />
