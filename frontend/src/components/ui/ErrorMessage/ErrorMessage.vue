<template>
	<div v-if="message" :class="$style.root" role="alert">
		<div :class="$style.content">
			<div v-if="code !== undefined && code !== null" :class="$style.code">{{ code }}</div>
			<div :class="$style.message">{{ message }}</div>
		</div>
		<div v-if="isNotFound" :class="$style.gifWrap">
			<div
				ref="tenorEmbed"
				class="tenor-gif-embed"
				data-postid="27713309"
				data-share-method="host"
				data-aspect-ratio="1.03896"
				data-width="100%"
			>
				<a href="https://tenor.com/view/travolta-waiting-white-gif-27713309">Travolta Waiting GIF</a
				>from <a href="https://tenor.com/search/travolta-gifs">Travolta GIFs</a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(
	defineProps<{
		code?: number | string
		message: string
	}>(),
	{},
)

const tenorEmbed = ref<HTMLDivElement | null>(null)
const isNotFound = computed(() => String(props.code) === '404')

const ensureTenorScript = (): void => {
	if (document.getElementById('tenor-embed-script')) {
		return
	}

	const script = document.createElement('script')
	script.id = 'tenor-embed-script'
	script.async = true
	script.src = 'https://tenor.com/embed.js'
	document.body.appendChild(script)
}

onMounted(() => {
	if (isNotFound.value && tenorEmbed.value) {
		ensureTenorScript()
	}
})
</script>

<style module lang="scss" src="./ErrorMessage.module.scss" />
