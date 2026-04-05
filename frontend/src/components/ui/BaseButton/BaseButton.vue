<template>
	<component
		:is="componentTag"
		v-bind="$attrs"
		:to="to"
		:type="buttonType"
		:disabled="disabled"
		:class="[$style.button, $style[variant]]"
	>
		<slot />
	</component>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'

defineOptions({ inheritAttrs: false })

type Variant = 'primary' | 'secondary' | 'ghost'

type ButtonType = 'button' | 'submit' | 'reset'

const props = withDefaults(
	defineProps<{
		variant?: Variant
		to?: RouteLocationRaw
		type?: ButtonType
		disabled?: boolean
	}>(),
	{
		variant: 'primary',
		type: 'button',
		disabled: false,
	},
)

const componentTag = props.to ? RouterLink : 'button'
const buttonType: ButtonType | undefined = props.to ? undefined : props.type
</script>

<style module lang="scss" src="./BaseButton.module.scss" />
