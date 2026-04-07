<template>
	<div :class="$style.root">
		<section :class="$style.card">
			<div :class="$style.header">
				<h1 :class="$style.title">Пользователи</h1>
				<p :class="$style.subtitle">Список зарегистрированных пользователей и хэши их паролей</p>
			</div>

			<div v-if="usersStore.loading" :class="$style.state">Загрузка…</div>
			<div v-else-if="usersStore.error" :class="$style.error">{{ usersStore.error }}</div>
			<div v-else-if="usersStore.users.length === 0" :class="$style.state">
				Пользователи не найдены.
			</div>

			<div v-else :class="$style.tableWrap">
				<table :class="$style.table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Фамилия</th>
							<th>Имя</th>
							<th>Отчество</th>
							<th>Пол</th>
							<th>Дата рождения</th>
							<th>Email</th>
							<th>Хэш пароля</th>
							<th>Дата регистрации</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="user in usersStore.users" :key="user.id">
							<td>{{ user.id }}</td>
							<td>{{ user.lastName }}</td>
							<td>{{ user.firstName }}</td>
							<td>{{ user.middleName ?? '—' }}</td>
							<td>{{ formatGender(user.gender) }}</td>
							<td>{{ formatBirthDate(user.birthDate) }}</td>
							<td>{{ user.email }}</td>
							<td :class="$style.hash">{{ user.password ?? 'null' }}</td>
							<td>{{ formatCreatedAt(user.createdAt) }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { useUsersStore } from '../../stores/usersStore'

const usersStore = useUsersStore()

const formatCreatedAt = (value?: string): string => {
	if (!value) return '—'
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return '—'
	return date.toLocaleString('ru-RU')
}

const formatBirthDate = (value: string): string => {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return '—'
	return date.toLocaleDateString('ru-RU')
}

const formatGender = (value: string): string => {
	if (value === 'male') return 'Мужской'
	return 'Женский'
}
onMounted(() => {
	void usersStore.loadUsers()
})
</script>

<style module lang="scss" src="./UsersPage.module.scss" />
